import {DefaultLinkModel, PortModel} from '@projectstorm/react-diagrams';
const NoteLinkModel = require('./NoteLinkModel.js')

class NotePortModel extends PortModel {
  constructor(pos, note) {
    super(pos, "note");
    this.note = note;
  }

  createLinkModel() {
    const that = this;
    const link = new NoteLinkModel();
    link.color = "black";
    link.addListener({
      selectionChanged: function(event) {
        link.togglePopover(event, that.note);
      }
    })
    return link;
  }
}

module.exports = NotePortModel;
