const SRD = require('@projectstorm/react-diagrams');
const NotePortModel = require('./NotePortModel.js');
const _ = require('lodash');

class NoteModel extends SRD.NodeModel {
  constructor(content, model, app) {
    super("note");
    this.content = content;
    this.model = model;
    this.app = app;
    this.display = false;
    this.selectedLinkId = null;
    this.addPort(new NotePortModel("bottom", this));
  }

  // todo: fix popover so that clicking outside of popover closes it
  displayLinkPopover(event, linkId) {
    if (linkId !== this.selectedLinkId) {
      this.display = !this.display
      this.selectedLinkId = linkId;
    }
  }

  serialize() {
    return _.merge(super.serialize(), {
      content: this.content
    })
  }

  deSerialize(ob, engine) {
    super.deSerialize(ob, engine);
    this.content = ob.content;
  }
}

module.exports = NoteModel;
