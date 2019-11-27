const SRD = require('@projectstorm/react-diagrams');
const NotePortModel = require('./NotePortModel.js');

class NoteModel extends SRD.NodeModel {
  constructor(content, model, app) {
    super("note");
    this.content = content;
    this.model = model;
    this.app = app;
    this.addPort(new NotePortModel("bottom", true));
    this.addPort(new NotePortModel("left", false));
  }
}

module.exports = NoteModel;
