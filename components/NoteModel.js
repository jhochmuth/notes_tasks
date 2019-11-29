const SRD = require('@projectstorm/react-diagrams');
const NotePortModel = require('./NotePortModel.js');

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

  // bug: code fires even when user has clicked inside of label form because of or clause.
  // bug: target of popover is port, should be link.
  displayLinkPopover(event, linkId) {
    if (linkId !== this.selectedLinkId || this.display !== event.isSelected) {
      console.log(event)
      this.selectedLinkId = linkId;
      this.display = !this.display;
    }
  }
}

module.exports = NoteModel;
