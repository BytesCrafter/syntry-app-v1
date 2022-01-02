const { app, BrowserWindow } = require('electron')
const { autoUpdater } = require("electron-updater")
const log = require('electron-log')
const path = require('path')

//-------------------------------------------------------------------
// Logging
//
// THIS SECTION IS NOT REQUIRED
//
// This logging setup is not required for auto-updates to work,
// but it sure makes debugging easier :)
//-------------------------------------------------------------------
autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = 'info';
log.info('App starting...');

//-------------------------------------------------------------------
// Open a window that displays the version
//
// THIS SECTION IS NOT REQUIRED
//
// This isn't required for auto-updates to work, but it's easier
// for the app to show a window than to have to click "About" to see
// that updates are working.
//-------------------------------------------------------------------
let win;

function sendStatusToWindow(text) {
  log.info(text);
  win.webContents.send('message', text);
}
function splashWindow() {
  win = new BrowserWindow({
    width: 320,
    height: 320,
    resizable: false,
    frame: false,
    closable: false,
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });
  win.on('closed', () => {
    win = null;
  });
  win.loadURL(`file://${__dirname}/splash.html#v${app.getVersion()}`);
  return win;
}
autoUpdater.on('checking-for-update', () => {
  sendStatusToWindow('Checking for update...');
})
autoUpdater.on('update-available', (info) => {
  sendStatusToWindow('Update available.');
})
autoUpdater.on('update-not-available', (info) => {
  sendStatusToWindow('Update not available.');
  BrowserWindow.getAllWindows().forEach(function (win) {
    win.close()
  })
  primaryWindow();
})
autoUpdater.on('error', (err) => {
  sendStatusToWindow('Error in auto-updater. ' + err);
})
autoUpdater.on('download-progress', (progressObj) => {
  let log_message = "Download speed: " + progressObj.bytesPerSecond;
  log_message = log_message + ' - Downloaded ' + progressObj.percent + '%';
  log_message = log_message + ' (' + progressObj.transferred + "/" + progressObj.total + ')';
  sendStatusToWindow(log_message);
})
autoUpdater.on('update-downloaded', (info) => {
  sendStatusToWindow('Update downloaded');
  autoUpdater.quitAndInstall(true, true);
});

function primaryWindow () {
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

//-------------------------------------------------------------------
// Auto updates - Option 1 - Simplest version
//-------------------------------------------------------------------
app.on('ready', function()  {
  splashWindow();
  autoUpdater.checkForUpdates(); //checkForUpdatesAndNotify
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
