const React = require('react');
const App = require('./App.js');
const stubs = require('./stubs.js');
const electron = require('electron');
const remote = electron.remote;
const BrowserWindow = remote.BrowserWindow;

/*
React component for the main menu.
*/
class MainMenu extends React.Component {
  constructor() {
    super();
    const that = this;
    this.loadDiagram = this.loadDiagram.bind(this);
  }

  createDiagram(event, file) {
    let win = new BrowserWindow({width: 1200, height: 1200, show: false, title: "Untitled Diagram"});

    win.on('closed', () => {
      win = null
    });

    win.loadURL(require('url').format({
      pathname: '/home/julius/notes_tasks/indexApp.html',
      protocol: 'file:',
      slashes: true
    }));

    win.once('ready-to-show', function() {
      win.webContents.openDevTools();
      win.show();
      if (file) {
        win.webContents.send('load', file);
      }
    });
  }

  loadDiagram() {
    const that = this;

    remote.dialog.showOpenDialog(function(file) {
      if (!file) return;
      that.createDiagram(null, file);
    });
  }

  render() {
    return (
      <div className="mainmenu">
        <img className="mainmenu-icon" src="/home/julius/notes_tasks/icons/mainIcon.png"/>
        <div className="mainmenu-title">Bibbit</div>
        <button id="new-document-button" className="mainmenu-button" onClick={this.createDiagram}>Create new mindmap</button>
        <button id="load-document-button" className="mainmenu-button" onClick={this.loadDiagram}>Load saved mindmap</button>
      </div>
    )
  }
}

module.exports = MainMenu;


/*
    const menu = remote.Menu.buildFromTemplate([
      {
        label: "File",
        submenu: [
          {
            label: "New Diagram",
            click() {that.createDiagram()}
          },
          {label: "Save As"},
          {label: "Save"},
          {
            label: "Open",
            click() {that.loadDiagram()}
          },
          {
            label: "Quit",
            click() {electron.remote.app.quit()}}
        ]
      },
      {
        label: "Debug",
        submenu: [
          {
            label: "Open Developer Tools",
            click() {electron.remote.getCurrentWebContents().openDevTools()}
          }
        ]
      }
    ])

    remote.Menu.setApplicationMenu(menu);
  }
*/
