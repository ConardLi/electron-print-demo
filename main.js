require('update-electron-app')({
  logger: require('electron-log')
})

const path = require('path')
const glob = require('glob')
const { app, BrowserWindow, ipcMain } = require('electron')

const debug = /--debug/.test(process.argv[2])

if (process.mas) app.setName('Electron APIs')

let mainWindow = null
let demoWindow = null;

function initialize() {
  const shouldQuit = makeSingleInstance()
  if (shouldQuit) return app.quit()

  loadDemos()

  function createWindow() {
    const windowOptions = {
      width: 1080,
      minWidth: 680,
      height: 840,
      title: app.getName(),
    }

    if (process.platform === 'linux') {
      windowOptions.icon = path.join(__dirname, '/assets/app-icon/png/512.png')
    }

    mainWindow = new BrowserWindow(windowOptions)
    mainWindow.loadURL(path.join('file://', __dirname, '/index.html'))

    // Launch fullscreen with DevTools open, usage: npm run debug
    if (debug) {
      mainWindow.webContents.openDevTools()
      mainWindow.maximize()
      require('devtron').install()
    }

    mainWindow.on('closed', () => {
      mainWindow = null
    })

    console.log(BrowserWindow.fromId(1));
  }

  function createPrintWindow() {
    const windowOptions = {
      width: 100,
      height: 100,
      title: '打印页',
      show: false,
    }
    demoWindow = new BrowserWindow(windowOptions);
    demoWindow.loadURL(path.join('file://', __dirname, './sections/print/print1.html'));

    initPrintEvent();
  }

  function initPrintEvent() {
    ipcMain.on('print-start', (event, deviceName) => {
      console.log('print-start');
      demoWindow.webContents.send('print-edit', deviceName);
    })

    ipcMain.on('do', (event, deviceName) => {
      const printers = demoWindow.webContents.getPrinters();
      printers.forEach(element => {
        if (element.name === deviceName) {
          console.log(element);
        }
        if (element.name === deviceName && element.status != 0) {
          mainWindow.send('print-error', deviceName + '打印机异常');
          return;
        }
      });
      demoWindow.webContents.print({ silent: true, printBackground: true, deviceName: deviceName },
        (data) => {
          console.log("回调", data);
          event.sender.send('print-successs')
        })
    })
  }

  app.on('ready', () => {
    createWindow()
    createPrintWindow()
  })

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit()
    }
  })

  app.on('activate', () => {
    if (mainWindow === null) {
      createWindow()
    }
  })
}

// Make this app a single instance app.
//
// The main window will be restored and focused instead of a second window
// opened when a person attempts to launch a second instance.
//
// Returns true if the current version of the app should quit instead of
// launching.
function makeSingleInstance() {
  if (process.mas) return false

  return app.makeSingleInstance(() => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore()
      mainWindow.focus()
    }
  })
}

// Require each JS file in the main-process dir
function loadDemos() {
  const files = glob.sync(path.join(__dirname, 'main-process/**/*.js'))
  files.forEach((file) => { require(file) })
}

initialize()
