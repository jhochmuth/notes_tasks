const SRD = require('@projectstorm/react-diagrams');

class NoteModel extends SRD.NodeModel {
  constructor(content) {
    super("note");
    this.content = content;
    this.addPort(new SRD.PortModel("bottom"));
  }
}

module.exports = NoteModel;
