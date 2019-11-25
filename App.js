const React = require('react');
const ReactDOM = require('react-dom');
const SRD = require('@projectstorm/react-diagrams');
const NoteCreationForm = require('./components/NoteCreationForm.js');
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
    model.addAll(new NoteModel(noteResponse));
    engine.setDiagramModel(model);
    this.forceUpdate();
  }

  render() {
    return (
      <div>
        <NoteCreationForm onSubmit={this.addNote} />
        <SRD.DiagramWidget diagramEngine={engine} className="srd-diagram" />
      </div>
);
  }
}

module.exports = App;
