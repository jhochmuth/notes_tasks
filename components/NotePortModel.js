import {DefaultLinkModel, PortModel} from '@projectstorm/react-diagrams';

class NotePortModel extends PortModel {
  constructor(pos, isInput) {
    super(pos, "note");
    this.in = isInput;
  }

  createLinkModel() {
    const link = new DefaultLinkModel();
    link.color = "black";
    return link;
  }
}

module.exports = NotePortModel;
