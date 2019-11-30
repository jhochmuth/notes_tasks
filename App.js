const fs = require('fs');
const React = require('react');
const ReactDOM = require('react-dom');
const SRD = require('@projectstorm/react-diagrams');
const Toolbar = require('./components/Toolbar.js');
const NoteModel = require('./components/NoteModel.js');
const NoteFactory = require('./components/NoteFactory.js');
const NoteLinkFactory = require('./components/NoteLinkFactory.js');
const NotePortFactory = require('./components/NotePortFactory.js');

const engine = new SRD.DiagramEngine();
engine.installDefaultFactories();
engine.registerNodeFactory(new NoteFactory());
engine.registerLinkFactory(new NoteLinkFactory());
engine.registerPortFactory(new NotePortFactory());
let model = new SRD.DiagramModel();

class App extends React.Component {
  constructor() {
    super();
    this.addNote = this.addNote.bind(this);
    this.save = this.save.bind(this);
    this.load = this.load.bind(this);
  }

  addNote(noteResponse) {
    const note = new NoteModel(noteResponse, model, this);
    model.addAll(note);
    engine.setDiagramModel(model);
    this.forceUpdate();
  }

  save() {
    const that = this;
    const serialized = model.serializeDiagram();
    const str = JSON.stringify(serialized);

    fs.writeFile('saved_diagrams/test.txt', str, function(err) {
      if (err) {
        console.log(err);
      }
      else {
        console.log("File saved");
      }
    });

    let model2 = new SRD.DiagramModel();
    model2.deSerializeDiagram(JSON.parse(str), engine);
    for (let node in model2.nodes) {
      model2.nodes[node].app = that;
      model2.nodes[node].model = model2;
    }
    console.log(model2);

    engine.setDiagramModel(model2);
    this.forceUpdate();
  }

  load() {
    const that = this;

    fs.readFile('saved_diagrams/test.txt', function(err, data) {
      if (err) {
        console.log(err);
      }
      else {
        const str = data.toString();
        model = new SRD.DiagramModel();
        model.deSerializeDiagram(JSON.parse(str), engine);

        for (let node in model.nodes) {
          model.nodes[node].app = that;
          model.nodes[node].model = model;
        }

        engine.setDiagramModel(model);
        that.forceUpdate();
      }
    })
  }

  render() {
    return (
      <div className="app">
        <div className="toolbar"><Toolbar createNote={this.addNote} save={this.save} load={this.load}/></div>
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
