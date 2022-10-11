const { app, BrowserWindow ,autoUpdater} = require('electron')
const path = require('path');


require('update-electron-app')
const server = 'homeonew-fnzkzncji-shubhamdaffodil.vercel.app'
const url = `${server}/${app.getVersion()}`

console.log(url)
autoUpdater.setFeedURL({ url })
function createWindow () {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })
  const startUrl =
  "http://localhost:3000" 

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
