const React = require('react');
const App = require('./App.js');
const stubs = require('./stubs.js');
const electron = require('electron');
const remote = electron.remote;
const BrowserWindow = remote.BrowserWindow;

class MainMenu extends React.Component {
  createNewDiagram() {
    let win = new BrowserWindow({width: 1200, height: 1200})
    win.on('closed', () => {
      win = null
    });

    win.loadURL(require('url').format({
      pathname: '/home/julius/notes_tasks/indexApp.html',
      protocol: 'file:',
      slashes: true
    }));
  }

  loadDiagram() {
    remote.dialog.showOpenDialog(function(file) {
      if (!file) return;

      const loadRequest = {file: file[0]};
    })
  }

  render() {
    return (
      <div className="mainmenu">
        <img className="mainmenu-icon" src="/home/julius/notes_tasks/icons/mainIcon.png"/>
        <div className="mainmenu-title">Mindmaps</div>
        <button id="new-document-button" className="mainmenu-button" onClick={this.createNewDiagram}>Create new mindmap</button>
        <button id="load-document-button" className="mainmenu-button" onClick={this.loadDiagram}>Load saved mindmap</button>
      </div>
    )
  }
}

module.exports = MainMenu;
