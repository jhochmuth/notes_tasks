const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const path = require('path');
const React = require('react');

/*************************************************************
 * Python backend startup
 *************************************************************/

const PY_DIST_FOLDER = 'pycalcdist'
const PY_FOLDER = ''
const PY_MODULE = 'server' // without .py suffix

let pyProc = null
let pyPort = null

const guessPackaged = () => {
  const fullPath = path.join(__dirname, PY_DIST_FOLDER)
  return require('fs').existsSync(fullPath)
}

const getScriptPath = () => {
  if (!guessPackaged()) {
    return path.join(__dirname, PY_FOLDER, PY_MODULE + '.py')
  }
  if (process.platform === 'win32') {
    return path.join(__dirname, PY_DIST_FOLDER, PY_MODULE, PY_MODULE + '.exe')
  }
  return path.join(__dirname, PY_DIST_FOLDER, PY_MODULE, PY_MODULE)
}

const selectPort = () => {
  pyPort = 50051
  return pyPort
}

const createPyProc = () => {
  let script = getScriptPath()
  let port = '' + selectPort()

  if (guessPackaged()) {
    pyProc = require('child_process').execFile(script)
  } else {
    pyProc = require('child_process').spawn('python', [script])
  }

  if (pyProc != null) {
    //console.log(pyProc)
    console.log('child process success on port ' + port)
  }
}

const exitPyProc = () => {
  pyProc.kill()
  pyProc = null
  pyPort = null
}

app.on('ready', createPyProc)
app.on('will-quit', exitPyProc)


/*************************************************************
 * Create electron window
 *************************************************************/

let mainWindow = null

const createWindow = () => {
  mainWindow = new BrowserWindow({width: 1200, height: 900, show: false})

  mainWindow.loadURL(require('url').format({
    pathname: path.join(__dirname, 'html/indexMenu.html'),
    protocol: 'file:',
    slashes: true
  }))
  //pathname: path.join(__dirname, 'html/indexMenu.html'),
  //pathname: path.join(__dirname, 'tabs', 'indexTabs.html'),

  mainWindow.once('ready-to-show', function() {
    mainWindow.show();
    mainWindow.reload();
    mainWindow.webContents.openDevTools()
  })

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

app.on('ready', createWindow)

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
