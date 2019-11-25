const React = require('react');
const ReactDOM = require('react-dom');
const DiagramComponent = require('@syncfusion/ej2-react-diagrams').DiagramComponent;
const NoteCreationForm = require('./NoteCreationForm2.js')

let diagramInstance;

let unrenderedAttrs = ["title", "text"];

function setupNode(note) {
  let obj = {};
  obj.width = 200;
  obj.height = 200;
  obj.offsetX = 250;
  obj.offsetY = 250;
  return obj;
}

class App extends React.Component {
  addNote(noteResponse) {
    let node = {};

    node.annotations = [
      {
        content: noteResponse.attrs.title,
        style: {bold: true},
        offset: {x: .5, y: .1},
      },
      {
        content: noteResponse.attrs.text,
        offset: {x: .5, y: .3}
      }
    ];

    let offsetY = .4;
    for (let attr in noteResponse.attrs) {
      if (!unrenderedAttrs.includes(attr)) {
        node.annotations.push({
          content: attr + ": " + noteResponse.attrs[attr],
          offset: {x: .5, y: offsetY}
        });
        offsetY += .1;
      }
    }
    diagramInstance.add(node)
  }

  createConnector() {
    let connector = {
      sourcePoint: {x: 100, y: 100},
      targetPoint: {x: 200, y: 200}
    }
    diagramInstance.add(connector);
  }

  render() {
    return (
      <div>
        <div>
          <NoteCreationForm onSubmit={this.addNote} />
          <button onClick={this.createConnector}>Create Connection</button>
          <div>
            <DiagramComponent
            id="diagram"
            ref={diagram => (diagramInstance = diagram)}
            layout={{type: "MindMap"}}
            getNodeDefaults={setupNode} />
          </div>
        </div>
      </div>
    )
  }
}

module.exports = App;
