const React = require('react');
const App = require('../App.js');
const stubs = require('../stubs.js');
const electron = require('electron');
const remote = electron.remote;
const BrowserWindow = remote.BrowserWindow;

// todo: fix stopgap solution for sending ipc messages (settimeout)
class MainMenu extends React.Component {
  constructor() {
    super();
    const that = this;
    this.loadDiagram = this.loadDiagram.bind(this);

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
      }
    ])

    remote.Menu.setApplicationMenu(menu);
  }

  createDiagram(event, file) {
    electron.ipcRenderer.sendToHost('fromTab', ["newDiagram", file ? file[0] : null])
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
