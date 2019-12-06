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
const stubs = require('./stubs.js');

const engine = new SRD.DiagramEngine();
engine.installDefaultFactories();
engine.registerNodeFactory(new NoteFactory());
engine.registerLinkFactory(new NoteLinkFactory());
engine.registerPortFactory(new NotePortFactory());
let model = new SRD.DiagramModel();

class App extends React.Component {
  constructor() {
    super();

    const that = this;

    ipcRenderer.on('load', function(event, file) {
      that.load(file[0]);
    });

    this.addNote = this.addNote.bind(this);
    this.save = this.save.bind(this);
    this.load = this.load.bind(this);
    this.onLoadButtonClick = this.onLoadButtonClick.bind(this);
  }

  addNote(event) {
    const that = this;
    const note = new NoteModel(null, model, this);
    const attrs = {title: event.target.title.value, text: event.target.text.value};
    const noteRequest = {id: note.id, attrs: attrs};

    stubs.noteStub.createNote(noteRequest, function(err, noteReply) {
      if (err) {
        console.log(err);
      }
      else {
        note.content = noteReply;
        model.addAll(note);
        engine.setDiagramModel(model);
        that.forceUpdate();
      }
    });
  }

  // todo: increase efficiency by avoiding saving twice
  save() {
    const that = this;

    remote.dialog.showSaveDialog(function(filename) {
      if (!filename) return;

      const saveRequest = {filename: filename};

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

  /// todo: change to use electron functionality
  onLoadButtonClick(event) {
    event.preventDefault();

    if (!event.target.file.value) {
      alert('You must specify a file to load.');
      return;
    }

    this.load('saved_diagrams/' + event.target.file.value.replace('C:\\fakepath\\', ''));
  }

  load(file) {
    const that = this;
    const loadRequest = {file: file};

    stubs.documentStub.loadDocument(loadRequest, function(err, response) {
      if (err) {
        console.log(err);
      }
      else {
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

  openListView() {
    const that = this;
    let win = new BrowserWindow({width: 800, height: 800, show: false});

    win.on('closed', () => {
      win = null
    });

    win.loadURL(require('url').format({
      pathname: '/home/julius/notes_tasks/indexList.html',
      protocol: 'file:',
      slashes: true
    }));

    win.once('ready-to-show', function() {
      win.webContents.openDevTools();
      win.show();
    });

    let data = [];

    for (let note in model.nodes) {
      data.push(model.nodes[note].content);
    }

    setTimeout(function() {
      win.webContents.send('listView', data);
    }, 500);
  }

  render() {
    return (
      <div className="app">
        <div className="toolbar">
          <Toolbar addNote={this.addNote}
            save={this.save}
            load={this.onLoadButtonClick}
            openListView={this.openListView}/>
        </div>
        <SRD.DiagramWidget
          diagramEngine={engine}
          smartRouting={true}
          className="srd-diagram"
          maxNumberPointsPerLink="0"
          deleteKeys={[27]}
        />
      </div>
    );
  }
}

module.exports = App;
