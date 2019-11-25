const SRD = require('@projectstorm/react-diagrams');

class NoteModel extends SRD.NodeModel {
  constructor(content) {
    super("note");
    this.content = content;
  }
}

module.exports = NoteModel;
