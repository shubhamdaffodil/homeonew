const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path');




async function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })
  const { machineIdSync } = require("node-machine-id");
  const machine_id = await machineIdSync({ original: true });
  win.webContents.once("dom-ready", () => {
    win.webContents.executeJavaScript(`localStorage.setItem('token','${machine_id}')`)

  })

    startUrl = "http://18.222.189.127:3006/"
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
