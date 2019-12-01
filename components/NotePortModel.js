import {DefaultLinkModel, PortModel} from '@projectstorm/react-diagrams';
const NoteLinkModel = require('./NoteLinkModel.js')
const _ = require('lodash');

class NotePortModel extends PortModel {
  constructor(pos, note) {
    super(pos, "note");
  }

  createLinkModel() {
    const that = this;
    const link = new NoteLinkModel();
    link.color = "black";
    link.addListener({
      selectionChanged: function(event) {
        link.togglePopover(event, that.parent);
      }
    })
    return link;
  }
}

module.exports = NotePortModel;
