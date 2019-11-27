import {DefaultLinkModel, PortModel} from '@projectstorm/react-diagrams';

class NotePortModel extends PortModel {
  constructor(pos) {
    super(pos, "note");
  }

  createLinkModel() {
    const link = new DefaultLinkModel();
    link.color = "black";
    return link;
  }
}

module.exports = NotePortModel;
