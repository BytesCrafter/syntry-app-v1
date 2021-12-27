const { app, BrowserWindow } = require('electron')
const path = require('path')

function createWindow () {
  const win = new BrowserWindow({
    width: 480,
    height: 720,
    resizable: false,
    frame: false,
    closable: false,
    autoHideMenuBar: true,
    //backgroundColor: '#ffffff',
    //icon: `file://${__dirname}/dist/assets/logo.png`,
    webPreferences: {
      //preload: path.join(__dirname, 'electron/preload.js'),
      nodeIntegration: true
    }
  })

  win.loadURL(`file://${__dirname}/www/index.html`)

  //win.webContents.openDevTools()
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
