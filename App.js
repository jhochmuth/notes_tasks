const React = require('react');
const ReactDOM = require('react-dom');
const SRD = require('@projectstorm/react-diagrams');
const Toolbar = require('./components/Toolbar.js');
const NoteModel = require('./components/NoteModel.js');
const NoteFactory = require('./components/NoteFactory.js');

const engine = new SRD.DiagramEngine();
engine.installDefaultFactories();
engine.registerNodeFactory(new NoteFactory());
const model = new SRD.DiagramModel();

class App extends React.Component {
  constructor() {
    super();
    this.addNote = this.addNote.bind(this);
  }

  addNote(noteResponse) {
    model.addAll(new NoteModel(noteResponse, model, this));
    engine.setDiagramModel(model);
    this.forceUpdate();
  }

  render() {
    return (
      <div className="app">
        <div className="toolbar"><Toolbar createNote={this.addNote} /></div>
        <SRD.DiagramWidget diagramEngine={engine} className="srd-diagram" deleteKeys={[]}/>
      </div>
    );
  }
}

module.exports = App;
