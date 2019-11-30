const fs = require('fs');
const React = require('react');
const ReactDOM = require('react-dom');
const SRD = require('@projectstorm/react-diagrams');
const Toolbar = require('./components/Toolbar.js');
const NoteModel = require('./components/NoteModel.js');
const NoteFactory = require('./components/NoteFactory.js');
const NoteLinkFactory = require('./components/NoteLinkFactory.js');

const engine = new SRD.DiagramEngine();
engine.installDefaultFactories();
engine.registerNodeFactory(new NoteFactory());
engine.registerLinkFactory(new NoteLinkFactory());
let model = new SRD.DiagramModel();

class App extends React.Component {
  constructor() {
    super();
    this.addNote = this.addNote.bind(this);
  }

  addNote(noteResponse) {
    const note = new NoteModel(noteResponse, model, this);
    const models = model.addAll(note);
    engine.setDiagramModel(model);
    this.forceUpdate();
  }

  save() {
    const serialized = model.serializeDiagram();
    const str = JSON.stringify(serialized);

    fs.writeFile('saved_diagrams/test.txt', str, function(err) {
      if (err) {
        console.log(err);
      }
      else {
        console.log("File saved");
      }
    })  
  }

  render() {
    return (
      <div className="app">
        <div className="toolbar"><Toolbar createNote={this.addNote} save={this.save}/></div>
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
