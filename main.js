const { app, Tray, Menu, BrowserWindow, Notification } = require('electron')
const log = require('electron-log')
  log.info('App starting...');
const path = require('path')
const iconPath = path.join(__dirname, 'logo.ico')

//-------------------------------------------------------------------
// Open a window that displays the version
// This isn't required for auto-updates to work, but it's easier
// for the app to show a window than to have to click "About" to see
// that updates are working.
//-------------------------------------------------------------------
let win;
let tray;

function createPrimaryWindow () {
  tray = new Tray(iconPath);
  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Syntry',
      click: async () => {
        win.show();
      }
    },
    {
      label: 'Developer',
      click: async () => {
        const { shell } = require('electron')
        await shell.openExternal('https://bytescrafter.net')
      }
    },
    {
      label: 'Quit',
      click: async () => {
        BrowserWindow.getAllWindows().forEach((curWin)=> {
          curWin.setClosable(true);
          curWin.close();
        })
      }
    }
  ])
  tray.setToolTip('Syntry')
  tray.setContextMenu(contextMenu)

  const primary = new BrowserWindow({
    width: 480,
    height: 720,
    resizable: false,
    frame: false,
    closable: false,
    autoHideMenuBar: true,
    darkTheme: true,
    //backgroundColor: '#ffffff',
    icon: path.join(__dirname, 'logo.ico'),
    webPreferences: {
      //preload: path.join(__dirname, 'electron/preload.js'),
      nodeIntegration: true
    }
  })
  primary.loadURL('https://syntry.web.app')
  //primary.loadURL(`file://${__dirname}/dist/htdocs/index.html`)
  //primary.webContents.openDevTools()

  primary.on('focus', () => {
    log.info('Focused on app...');
  });

  primary.on('unresponsive', () => {
    log.info('App is currently busy...');
  });

  primary.on('maximize', () => {
    log.info('Showing from tray...');
  });

  primary.on('minimize', () => {
    log.info('Hiding on tray...');
    primary.hide();
  });

  return primary;
}

app.whenReady().then(() => {
  log.info('App is ready...');
  win = createPrimaryWindow();
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
