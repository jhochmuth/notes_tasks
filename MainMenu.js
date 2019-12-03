const React = require('react');
const App = require('./App.js');
const stubs = require('./stubs.js');
const electron = require('electron');
const remote = electron.remote;
const BrowserWindow = remote.BrowserWindow;

// todo: fix stopgap solution for sending ipc messages (settimeout)
class MainMenu extends React.Component {
  constructor() {
    super();
    this.loadDiagram = this.loadDiagram.bind(this);
  }

  createDiagram(event, file) {
    let win = new BrowserWindow({width: 1200, height: 1200})
    win.on('closed', () => {
      win = null
    });

    win.loadURL(require('url').format({
      pathname: '/home/julius/notes_tasks/indexApp.html',
      protocol: 'file:',
      slashes: true
    }))

    if (file) {
      setTimeout(function() {
        win.webContents.send('load', file)
      }, 500)
    }

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
        <div className="mainmenu-title">Mindmaps</div>
        <button id="new-document-button" className="mainmenu-button" onClick={this.createDiagram}>Create new mindmap</button>
        <button id="load-document-button" className="mainmenu-button" onClick={this.loadDiagram}>Load saved mindmap</button>
      </div>
    )
  }
}

module.exports = MainMenu;
