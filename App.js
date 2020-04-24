const fs = require('fs');
const remote = require('electron').remote;
const BrowserWindow = remote.BrowserWindow;
const ipcRenderer = require('electron').ipcRenderer;
const React = require('react');
const ReactDOM = require('react-dom');
const SRD = require('@projectstorm/react-diagrams');
const Toolbar = require('./components/Toolbar.js');
const FilterDisplay = require('./components/FilterDisplay.js');
const NoteModel = require('./components/NoteModel.js');
const NoteFactory = require('./components/NoteFactory.js');
const NoteLinkFactory = require('./components/NoteLinkFactory.js');
const NotePortFactory = require('./components/NotePortFactory.js');
const ContainerModel = require('./components/ContainerModel.js');
const ContainerFactory = require('./components/ContainerFactory.js');
const stubs = require('./stubs.js');
const Filter = require('./utils/filter.js');
const path = require('path');
import {Button} from 'reactstrap';

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
  // todo: add way to delete connection labels
  // TODO: CHECK BACKEND FOR OBJECT COPIES/REFS
  constructor(props) {
    super(props);

    this.state = {filters: []};

    this.listWin = null;
    this.documentId = props.documentId;
    this.diagramRef = React.createRef();
    this.noteRefs = {};

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
  }

  addNote(event) {
    const that = this;
    const ref = React.createRef();
    const note = new NoteModel(null, model, this, ref);
    note.x = 200;
    note.y = 200;

    const attrs = {title: event.target.title.value};
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
        that.noteRefs[note.id] = ref;

        that.state.filters.forEach((filter) => {
          that.noteRefs[noteReply.id].current.applyFilter(filter)
        });
      }
    });
  }

  createDescendantNote(prototypeId) {
    const that = this;
    const ref = React.createRef();
    const note = new NoteModel(null, model, this, ref);

    const descendantNoteRequest = {
      id: prototypeId,
      document_id: this.documentId,
      descendant_id: note.id
    }

    stubs.noteStub.CreateDescendantNote(descendantNoteRequest, function(err, noteReply) {
      if (err) {
        console.log(err);
      }
      else {
        note.content = noteReply;
        model.addAll(note);
        engine.setDiagramModel(model);
        that.forceUpdate();

        that.updateListView();
        that.noteRefs[note.id] = ref;

        that.state.filters.forEach((filter) => {
          that.noteRefs[noteReply.id].current.applyFilter(filter)
        });
      }
    });
  }

  createInheritorNote(event) {
    const data = JSON.parse(event.dataTransfer.getData('create-from-archetype'));
    const points = engine.getRelativeMousePoint(event);
    const that = this;
    const ref = React.createRef();
    const note = new NoteModel(null, model, this, ref);
    note.x = points.x;
    note.y = points.y;

    const request = {
      note_id: note.id,
      archetype_id: data.id,
      document_id: this.documentId
    }

    stubs.noteStub.createInheritor(request, function(err, reply) {
      if (err) {
        console.log(err);
      }
      else {
        note.content = reply;

        model.addAll(note);
        engine.setDiagramModel(model);
        that.forceUpdate();

        that.updateListView();
        that.noteRefs[note.id] = ref;

        that.state.filters.forEach((filter) => {
          that.noteRefs[noteReply.id].current.applyFilter(filter)
        });
      }
    });
  }

  updateNoteAttr(updateAttrRequest) {
    const that = this;

    let call = stubs.noteStub.updateNoteAttr(updateAttrRequest);

    call.on('data', function(noteReply) {
      const note = that.noteRefs[noteReply.id].current;
      const attrs = noteReply.attrs;
      const newState = Object.assign({}, note.state);
      newState.attrs = attrs;

      newState.inherited_attrs = noteReply.inherited_attrs;
      note.setState(newState);
      note.props.node.content = noteReply;

      that.state.filters.forEach((filter) => {
        note.applyFilter(filter)
      });

      note.props.node.app.updateListView();
    });
  }

  updateNoteAttrArchetype(id, attrs) {
    const note = this.noteRefs[id].current;
    const newState = Object.assign({}, note.state);
    newState.attrs = attrs;
    note.setState(newState);

    this.state.filters.forEach((filter) => {
      note.applyFilter(filter)
    });

    note.props.node.app.updateListView();
  }

  removePrototypes(descendantIds) {
    const that = this;
    descendantIds.forEach((descendantId) => {
      const descendant = that.noteRefs[descendantId].current;
      const newState = Object.assign({}, descendant.state);
      newState.prototypeId = null;
      descendant.setState(newState);
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
        pathname: path.join(__dirname, 'html/indexList.html'),
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

  addFilter(event) {
    const that = this;

    const filter = new Filter(event.target.attr.value, event.target.value.value, "contains");

    for (let ref in that.noteRefs) {
      that.noteRefs[ref].current.applyFilter(filter);
    }

    const newState = Object.assign({}, this.state);
    newState.filters.push(filter);
    this.setState(newState);
  }

  deleteFilter(filter) {
    const that = this;
    let index = this.state.filters.indexOf(filter);

    const newState = Object.assign({}, this.state);
    newState.filters.splice(index, 1);
    this.setState(newState);

    for (let ref in that.noteRefs) {
      that.noteRefs[ref].current.removeFilter(filter);
    }
  }

  render() {
    return (
      <div className="app">
        <div className="toolbar">
          <Toolbar addNote={this.addNote}
            addContainer={this.addContainer}
            addFilter={(event) => this.addFilter(event)}
            save={this.save}
            load={this.onLoadButtonClick}
            openListView={this.openListView}/>
        </div>
        <div
          onDrop={(event) => this.createInheritorNote(event)}
          onDragOver={(event) => event.preventDefault()}
        >
          <SRD.DiagramWidget
            diagramEngine={engine}
            smartRouting={false}
            className="srd-diagram"
            maxNumberPointsPerLink="0"
            deleteKeys={[27]}
            ref={this.diagramRef}
          />
        </div>
        <FilterDisplay
          filters={this.state.filters}
          deleteFilter={(filter) => this.deleteFilter(filter)}
          documentId={this.documentId}
          updateNoteAttr={(id, attrs) => this.updateNoteAttrArchetype(id, attrs)}
        />
        <Button style={{postion: "absolute", zIndex: 20, top: 10, left: 10}} onClick={() => this.toggleModal()}>Click</Button>
      </div>
    );
  }
}

module.exports = App;
