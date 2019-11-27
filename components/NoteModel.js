const SRD = require('@projectstorm/react-diagrams');

class NoteModel extends SRD.NodeModel {
  constructor(content, model, app) {
    super("note");
    this.content = content;
    this.model = model;
    this.app = app;
    this.addPort(new SRD.PortModel("bottom"));
  }
}

module.exports = NoteModel;
