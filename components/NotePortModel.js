import {DefaultLinkModel, PortModel} from '@projectstorm/react-diagrams';

class NotePortModel extends PortModel {
  constructor(pos) {
    super(pos, "note");
  }

  createLinkModel() {
    const link = new DefaultLinkModel();
    link.color = "black";
    link.addListener({selectionChanged: function(event) {
      console.log(event)
    }})
    return link;
  }
}

module.exports = NotePortModel;
