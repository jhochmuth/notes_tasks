const SRD = require('@projectstorm/react-diagrams');
const NotePortModel = require('./NotePortModel.js');
const _ = require('lodash');
const stubs = require('../stubs.js');

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
      this.display = !this.display;
      this.selectedLinkId = linkId;
    }
  }

  serialize() {
    return _.merge(super.serialize(), {
      content: this.content,
      model: this.model.getID()
    })
  }

  deSerialize(ob, engine) {
    super.deSerialize(ob, engine);
    this.content = ob.content;
  }

  // todo: forceUpdate still necessary if user deletes note with x button. fix.
  remove() {
    const that = this;
    const noteRequest = {id: this.content.id, document_id: this.app.documentId};

    for (let linkId in this.ports.bottom.links) {
      this.ports.bottom.links[linkId].remove();
    }

    stubs.noteStub.deleteNote(noteRequest, function(err, response) {
      if (err) {
        console.log(err);
      }

      else {
        if (response.val) {
          that.model.removeNode(that);
          that.app.forceUpdate();
          that.app.updateListView();
        }
      }
    })

    super.remove();
  }
}

module.exports = NoteModel;
