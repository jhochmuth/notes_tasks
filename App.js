const fs = require('fs');
const remote = require('electron').remote;
const BrowserWindow = remote.BrowserWindow;
const ipcRenderer = require('electron').ipcRenderer;
const React = require('react');
const ReactDOM = require('react-dom');
const SRD = require('@projectstorm/react-diagrams');
const Toolbar = require('./components/Toolbar.js');
const NoteModel = require('./components/NoteModel.js');
const NoteFactory = require('./components/NoteFactory.js');
const NoteLinkFactory = require('./components/NoteLinkFactory.js');
const NotePortFactory = require('./components/NotePortFactory.js');
const ContainerModel = require('./components/ContainerModel.js');
const ContainerFactory = require('./components/ContainerFactory.js');
const stubs = require('./stubs.js');

const engine = new SRD.DiagramEngine();
engine.installDefaultFactories();
engine.registerNodeFactory(new NoteFactory());
engine.registerLinkFactory(new NoteLinkFactory());
engine.registerPortFactory(new NotePortFactory());
engine.registerNodeFactory(new ContainerFactory());
let model = new SRD.DiagramModel();

/*
React component for the main app page.
*/
class App extends React.Component {
  // todo: add change title button
  // todo: connection remove() method does not activate when esc button pressed
  // todo: find solution for removing documents from dict when window is closed
  // todo: close any popups when esc button pressed (particularly connection label popup)
  // todo: add way to delete connection labels
  constructor() {
    super();

    this.listWin = null;
    this.documentId = null;

    this.addNote = this.addNote.bind(this);
    this.addContainer = this.addContainer.bind(this);
    this.save = this.save.bind(this);
    this.load = this.load.bind(this);
    this.onLoadButtonClick = this.onLoadButtonClick.bind(this);
    this.openListView = this.openListView.bind(this);
  }

  componentDidMount() {
    const that = this;

    ipcRenderer.on('load', function(event, file) {
      that.load(file[0]);
    });

    ipcRenderer.on('close', function(event) {
      that.sendCloseRequest();
    });

    stubs.documentStub.createDocument(null, function(err, documentReply) {
      if (err) {
        console.log(err);
      }
      else {
        that.documentId = documentReply.id;
      }
    });
  }

  addNote(event) {
    const that = this;
    const note = new NoteModel(null, model, this);
    const attrs = {title: event.target.title.value, text: event.target.text.value};
    const noteRequest = {id: note.id, attrs: attrs, document_id: this.documentId};

    stubs.noteStub.createNote(noteRequest, function(err, noteReply) {
      if (err) {
        console.log(err);
      }
      else {
        note.content = noteReply;
        model.addAll(note);
        engine.setDiagramModel(model);
        that.forceUpdate();

        that.updateListView();
      }
    });
  }

  addContainer(event) {
    const container = new ContainerModel();
    model.addAll(container);
    engine.setDiagramModel(model);
    this.forceUpdate();
  }

  // todo: increase efficiency by avoiding saving twice
  save() {
    const that = this;

    remote.dialog.showSaveDialog(function(filename) {
      if (!filename) return;

      const saveRequest = {filename: filename, document_id: that.documentId};

      stubs.documentStub.saveDocument(saveRequest, function(err, response) {
        if (err) {
          console.log(err);
        }
        else {
          let serializedFrontend = model.serializeDiagram();

          fs.readFile(filename, function(err, data) {
            if (err) {
              console.log(err);
            }
            else {
              const strPartial = data.toString();
              const serializedFull = JSON.parse(strPartial);
              serializedFull.frontend = serializedFrontend;
              const strFull = JSON.stringify(serializedFull);

              fs.writeFile('saved_diagrams/test.txt', strFull, function(err) {
                if (err) {
                  console.log(err);
                }
                else {
                  console.log("Diagram saved.");
                }
              });
            }
          });
        }
      });
    });
  }

  onLoadButtonClick() {
    const that = this;

    remote.dialog.showOpenDialog(function(file) {
      if (!file) return;
      that.load(file[0]);
    });
  }

  load(file) {
    const that = this;
    this.sendCloseRequest();

    const loadRequest = {file: file};

    stubs.documentStub.loadDocument(loadRequest, function(err, response) {
      if (err) {
        console.log(err);
      }
      else {
        that.documentId = response.id;

        fs.readFile(file, function(err, data) {
          if (err) {
            console.log(err);
          }
          else {
            const str = data.toString();
            model = new SRD.DiagramModel();
            model.deSerializeDiagram(JSON.parse(str).frontend, engine);

            for (let node in model.nodes) {
              model.nodes[node].app = that;
              model.nodes[node].model = model;
            }

            engine.setDiagramModel(model);
            that.forceUpdate();
          }
        });
      }
    });
  }

  updateListView() {
    let data = {};
    const that = this;

    if (that.listWin) {
      for (let id in model.nodes) {
        data[id] = model.nodes[id].content;
      }

    that.listWin.webContents.send('listView', data);
    }
  }

  openListView() {
    const that = this;

    if (!that.listWin) {
      that.listWin = new BrowserWindow({width: 800, height: 800, show: false});
      that.listWin.setMenu(null);
      that.listWin.on('closed', () => {
        that.listWin = null;
      });

      that.listWin.loadURL(require('url').format({
        pathname: '/home/julius/notes_tasks/indexList.html',
        protocol: 'file:',
        slashes: true
      }));

      that.listWin.once('ready-to-show', function() {
        that.listWin.webContents.openDevTools();
        that.listWin.show();
        that.updateListView();
      });
    }

    else {
      that.listWin.focus();
    }
  }

  sendCloseRequest() {
    const closeRequest = {id: this.documentId};

    stubs.documentStub.closeDocument(closeRequest, function(err, response) {
      if (err) {
        console.log(err);
      }
    });
  }

  render() {
    return (
      <div className="app">
        <div className="toolbar">
          <Toolbar addNote={this.addNote}
            addContainer={this.addContainer}
            save={this.save}
            load={this.onLoadButtonClick}
            openListView={this.openListView}/>
        </div>
        <SRD.DiagramWidget
          diagramEngine={engine}
          smartRouting={false}
          className="srd-diagram"
          maxNumberPointsPerLink="0"
          deleteKeys={[27]}
        />
      </div>
    );
  }
}

module.exports = App;
