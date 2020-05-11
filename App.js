const fs = require('fs');
const remote = require('electron').remote;
const BrowserWindow = remote.BrowserWindow;
const ipcRenderer = require('electron').ipcRenderer;
const React = require('react');
const ReactDOM = require('react-dom');
const SRD = require('@projectstorm/react-diagrams');
const AppToolbar = require('./components/Toolbar2.js');
const DrawerDisplay = require('./components/DrawerDisplay.js');
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
const {google} = require('googleapis');
import ReactModal from 'react-modal';
import {TreeViewComponent} from '@syncfusion/ej2-react-navigations';

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

    this.state = {filters: [], files: [], displayDriveFiles: false};

    this.treeWin = null;
    this.documentId = props.documentId;
    this.diagramRef = React.createRef();
    this.noteRefs = {};
    this.treeIdToDriveId = {};
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

  addNote(title) {
    const that = this;
    const ref = React.createRef();
    const note = new NoteModel(null, model, this, ref);

    const attrs = {title: title};
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

        that.updateTreeView();
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

        that.updateTreeView();
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
      archetype_id: data,
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

        that.updateTreeView();
        that.noteRefs[note.id] = ref;

        that.state.filters.forEach((filter) => {
          that.noteRefs[noteReply.id].current.applyFilter(filter)
        });
      }
    });
  }

  createNoteFromDriveFile(event) {
    // todo: do not create note if note already exists for that item
    const that = this;
    let id = this.treeIdToDriveId[event.nodeData.id];

    const request = {
      item_id: id,
      document_id: this.documentId
    };

    let call = stubs.documentStub.createNotesFromDrive(request);

    call.on('data', function(noteReply) {
      const ref = React.createRef();
      const note = new NoteModel(null, model, that, ref);
      note.id = noteReply.id

      note.content = noteReply;
      model.addAll(note);
      engine.setDiagramModel(model);
      that.forceUpdate();

      that.updateTreeView();
      that.noteRefs[note.id] = ref;

      that.state.filters.forEach((filter) => {
        that.noteRefs[noteReply.id].current.applyFilter(filter);
      });
    });

    call.on('error', (err) => console.log(err))
  }

  updateNoteAttr(updateAttrRequest) {
    const that = this;

    let call = stubs.noteStub.updateNoteAttr(updateAttrRequest);

    call.on('data', function(noteReply) {
      const note = that.noteRefs[noteReply.id].current;
      const attrs = noteReply.attrs;
      const newState = Object.assign({}, note.state);
      newState.attrs = attrs;
      newState.inheritedAttrs = noteReply.inherited_attrs;
      note.setState(newState);
      note.props.node.content = noteReply;

      that.state.filters.forEach((filter) => {
        note.applyFilter(filter)
      });

      note.props.node.app.updateTreeView();
    });
  }

  updateNoteAttrArchetype(id, attrs, inheritedAttrs) {
    const note = this.noteRefs[id].current;
    const newState = Object.assign({}, note.state);
    newState.attrs = attrs;
    newState.inheritedAttrs = inheritedAttrs;
    note.setState(newState);

    this.state.filters.forEach((filter) => {
      note.applyFilter(filter)
    });

    note.props.node.app.updateTreeView();
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

  updateTreeView() {
    let data = {};
    const that = this;

    if (that.treeWin) {
      for (let id in model.nodes) {
        data[id] = model.nodes[id].content;
      }

    that.treeWin.webContents.send('treeView', data);
    }
  }

  openTreeView() {
    const that = this;

    if (!that.treeWin) {
      that.treeWin = new BrowserWindow({width: 800, height: 800, show: false});
      that.treeWin.setMenu(null);
      that.treeWin.on('closed', () => {
        that.treeWin = null;
      });

      that.treeWin.loadURL(require('url').format({
        pathname: path.join(__dirname, 'html/indexTreeView.html'),
        protocol: 'file:',
        slashes: true
      }));

      that.treeWin.once('ready-to-show', function() {
        that.treeWin.webContents.openDevTools();
        that.treeWin.show();
        that.updateTreeView();
      });
    }

    else {
      that.treeWin.focus();
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

  syncDrive(event) {
    event.preventDefault();

    const that = this;

    const request = {
      drive: "gdrive",
      item_id: event.target.drive.value,
      document_id: this.documentId
    }

    let call = stubs.documentStub.syncDrive(request);

    call.on('data', function(noteReply) {
      if (noteReply.id in that.noteRefs) {
        const note = that.noteRefs[noteReply.id].current;
        const attrs = noteReply.attrs;
        const newState = Object.assign({}, note.state);
        newState.attrs = attrs;

        note.setState(newState);
        note.props.node.content = noteReply;

        that.state.filters.forEach((filter) => {
          note.applyFilter(filter)
        });

        note.props.node.app.updateTreeView();
      }

      else {
        const ref = React.createRef();
        const note = new NoteModel(null, model, that, ref);
        note.id = noteReply.id

        note.content = noteReply;
        model.addAll(note);
        engine.setDiagramModel(model);
        that.forceUpdate();

        that.updateTreeView();
        that.noteRefs[note.id] = ref;

        that.state.filters.forEach((filter) => {
          that.noteRefs[noteReply.id].current.applyFilter(filter);
        })
      }
    });

  call.on("error", (err) => alert(err));

  call.on("end", () => alert("end"));
  }

  uploadToDrive() {
    const that = this;

    const request = {
      document_id: this.documentId,
      drive: "gdrive"
    }

    let call = stubs.documentStub.uploadToDrive(request);

    call.on('data', function(noteReply) {
      const note = that.noteRefs[noteReply.id].current;
      const attrs = noteReply.attrs;
      const newState = Object.assign({}, note.state);
      newState.attrs = attrs;

      note.setState(newState);
      note.props.node.content = noteReply;

      that.state.filters.forEach((filter) => {
        note.applyFilter(filter)
      });

      note.props.node.app.updateTreeView();
    })

    call.on('end', () => alert("end"));
  }

  // note: Windows and Linux does not allow selectors to be both file and dir.
  createNoteFromFile() {
    const that = this;

    remote.dialog.showOpenDialog({properties: ['openFile', 'openDirectory']}, function(result) {
      if (!result) return;

      const request = {
        document_id: that.documentId,
        paths: result
      }

      let call = stubs.noteStub.createNoteFromFile(request);

      call.on('data', function(response) {
        const ref = React.createRef();
        const note = new NoteModel(null, model, that, ref);
        note.id = response.id

        note.content = response;
        model.addAll(note);
        engine.setDiagramModel(model);
        that.forceUpdate();

        that.updateTreeView();
        that.noteRefs[note.id] = ref;

        that.state.filters.forEach((filter) => {
          that.noteRefs[noteReply.id].current.applyFilter(filter)
        });
      })
    })
  }

  populateDriveFileManager() {
    const that = this;

    fs.readFile('credentials.json', (err, content) => {
      if (err) return console.log('Error loading client secret file:', err);
      authorize(JSON.parse(content), getFiles);
    });

    function authorize(credentials, callback) {
      const {client_secret, client_id, redirect_uris} = credentials.installed;
      const oAuth2Client = new google.auth.OAuth2(
          client_id, client_secret, redirect_uris[0]);

      // Check if we have previously stored a token.
      fs.readFile('token.json', (err, token) => {
        if (err) return getAccessToken(oAuth2Client, callback);
        oAuth2Client.setCredentials(JSON.parse(token));
        callback(oAuth2Client);
      });
    }

    function getFiles(auth) {
      const drive = google.drive({version: 'v3', auth});
      drive.files.list({q: "trashed: false", fields: "*"}, (err, res) => {
        if (err) return console.log('The API returned an error: ' + err);
        const files = res.data.files;
        let id = 1;
        let newFiles = [];
        let folderIds = {};
        that.treeIdToDriveId = {};

        files.forEach((file) => {
          that.treeIdToDriveId[id] = file.id;
          let fileObj = {id: id, driveId: file.id, name: file.name};
          fileObj.kind = file.capabilities.canAddChildren ? "folder" : "file";

          if (fileObj.kind == "file") {
            fileObj.pid = file.parents[0]
            fileObj.hasChildren = false;
          }
          else {
            folderIds[file.id] = id;
            fileObj.hasChildren = true;
          }

          fileObj.imageUrl = file.iconLink;
          newFiles.push(fileObj);
          id += 1;
        });

        newFiles.forEach((file) => {
          if (file.kind == "file") {
            file.pid = folderIds[file.pid];
          }
        });

        const newState = Object.assign({}, that.state);
        newState.files = newFiles;
        that.setState(newState);
      });
    }
  }

  toggleDriveFiles() {
    if (!this.state.displayDriveFiles) {
      this.populateDriveFileManager()
    }

    const newState = {...this.state};
    newState.displayDriveFiles = !newState.displayDriveFiles;
    this.setState(newState);
  }

  render() {
    const fields = {
      dataSource: this.state.files,
      id: 'id',
      text: 'name',
      parentID: 'pid',
      hasChildren: 'hasChildren'
    };

    return (
      <div className="app">
        <div id="toolbar">
          <AppToolbar
            addNote={(event) => this.addNote(event)}
            addContainer={() => this.addContainer()}
            addFilter={(event) => this.addFilter(event)}
            save={() => this.save()}
            load={() => this.onLoadButtonClick()}
            syncOneDrive={(event) => this.syncDrive(event)}
            openTreeView={() => this.openTreeView()}
            uploadToDrive={() => this.uploadToDrive()}
            createNoteFromFile={() => this.createNoteFromFile()}
            toggleDriveFiles={() => this.toggleDriveFiles()}
          />
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
        <DrawerDisplay
          filters={this.state.filters}
          deleteFilter={(filter) => this.deleteFilter(filter)}
          documentId={this.documentId}
          updateNoteAttr={(id, attrs, inheritedAttrs) => this.updateNoteAttrArchetype(id, attrs, inheritedAttrs)}
        />
        <ReactModal
          isOpen={this.state.displayDriveFiles}
          onRequestClose={() => this.toggleDriveFiles()}
          style={{
            content: {
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              backgroundColor: "#F5F5F5",
              height: "60%",
              width: "75%"
            }
          }}
          ariaHideApp={false}
        >
          <TreeViewComponent
            id="treeview"
            fields={fields}
            nodeSelected={(event) => this.createNoteFromDriveFile(event)}
          />
        </ReactModal>
      </div>
    );
  }
}

module.exports = App;
