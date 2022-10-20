const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path');




async function createWindow() {
  const win = new BrowserWindow({
    show: false,
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      devtool: true
    },
    backgroundColor: "red"
  })
  const { machineIdSync } = require("node-machine-id");
  const machine_id = await machineIdSync({ original: true });
  win.webContents.once("dom-ready", () => {
    win.show()
    win.webContents.executeJavaScript(`localStorage.setItem('token','${machine_id}')`)

  })
  startUrl = "http://localhost:3000"
  win.loadURL(startUrl)
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
