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
      nodeIntegrationInWorker: true,
      enableRemoteModule: true,
      plugins: true,
      contextIsolation: false,
      webSecurity: false,
    },
  });
  if (process.platform !== "darwin") {
    win.setMenuBarVisibility(false);
  }
  var serialNumber = require('serial-number');
  serialNumber(function (err, machine_id) {
    win.webContents.once("dom-ready", () => {
      loadingwin.close();
      win.maximize();
      win.show();
    win.webContents.executeJavaScript(
      `localStorage.setItem('token','${machine_id}')`
    );
  });
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
  // startUrl = "http://localhost:3000/";
  // startUrl = "http://13.58.158.167:3006/";
  // startUrl = "http://18.117.138.112:3000/";
  // startUrl = "http://43.205.111.78:3000/";
  // startUrl = "https://web.synergy-homeopathi.com/";
  startUrl = "https://deweb.synergy-homeopathic.com/";
  // startUrl = "https://en.synergy-homeopathic.com/";
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
