const React = require('react');
const SRD = require('@projectstorm/react-diagrams');
const NoteModel = require('./NoteModel.js');
const NoteWidget = require('./NoteWidget.js');

class NoteFactory extends SRD.AbstractNodeFactory {
  constructor() {
    super("note");
  }

  generateReactWidget(diagramEngine, node) {
    return <NoteWidget node={node}/>;
  }

  getNewInstance() {
    return new NoteModel();
  }
}

module.exports = NoteFactory;
