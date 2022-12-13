const { app, BrowserWindow, ipcMain, dialog } = require("electron");
const url = require("url");
const path = require("path");

let PreventClose = true;
let downloadPath = "";

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
      nodeIntegration: true,
      contextIsolation: true,
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
    const fileName = item.getFilename();
    if (fileName.includes("index-i")) {
      let path;
      if (fileName.includes("index-i0")) {
        path = dialog.showOpenDialogSync({
          message: "Select/create folder for backup location",
          properties: ["openDirectory", "createDirectory", "promptToCreate"],
          buttonLabel: "Backup",
        })[0];

        downloadPath = path;
      } else {
        path = downloadPath;
      }
      path = `${path}\\${item.getFilename()}`;
      path = path.slice(0, path.indexOf("index-i"));
      item.setSavePath(path);
    }
  });

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
  startUrl = "https://web.synergy-homeopathic.com/";
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
