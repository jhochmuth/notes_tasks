import {DefaultLinkModel, PortModel} from '@projectstorm/react-diagrams';
const NoteLinkModel = require('./NoteLinkModel.js')
const _ = require('lodash');

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

  serialize() {
    return _.merge(super.serialize(), {
      note: this.note.getID()
    })
  }

  deSerialize(ob, engine) {
    super.deSerialize(ob, engine);
  }
}

module.exports = NotePortModel;
