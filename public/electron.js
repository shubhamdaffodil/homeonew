const { app, BrowserWindow, ipcMain } = require("electron");
const url = require("url");
const path = require("path");

let PreventClose = true;
async function createWindow() {
  const loadingwin = new BrowserWindow({
    width: 350,
    height: 350,
    transparent: true,
    frame: false,
    center: true,
    resizable: false,
  });

  const loadingScreen = url.format({
    pathname: path.join(__dirname, "loading.html"),
    protocol: "file:",
    slashes: true,
  });

  loadingwin.loadURL(loadingScreen);
  const win = new BrowserWindow({
    show: false,
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      devTools: false,
      nodeIntegration:    true,
      contextIsolation:   true,
    },
  });
  if (process.platform !== "darwin") {
    win.setMenuBarVisibility(false);
  }
  const { machineIdSync } = require("node-machine-id");
  const machine_id = await machineIdSync({ original: true });
  win.webContents.once("dom-ready", () => {
    loadingwin.close();
    win.maximize();
    win.show();
    win.webContents.executeJavaScript(
      `localStorage.setItem('token','${machine_id}')`
    );
  });
  win.webContents.session.on("will-download", (event, item, webContents) => {
    item.setSavePath(`${app.getPath("downloads")}\\${item.getFilename()}`)
  })

  ipcMain.on("close-window", (event, data) => {
    PreventClose = data;
    win.close();
  });
  win.on("close", (event, data) => {
    if (PreventClose) {
      event.preventDefault();
      PreventClose = false;
      win && win.webContents.send("checkData");
    }
  });
  startUrl = "http://18.222.189.127:3006";
  win.loadURL(startUrl);
}

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
