import {DefaultLinkModel, PortModel} from '@projectstorm/react-diagrams';
const NoteLinkModel = require('./NoteLinkModel.js')
const _ = require('lodash');
const stubs = require('../stubs.js');

class NotePortModel extends PortModel {
  constructor(pos, note) {
    super(pos, "note");
  }

  createLinkModel() {
    const that = this;
    const link = new NoteLinkModel();
    link.color = "black";
    const connectionRequest = {id: link.id, endpoint_one_id: this.parent.content.id};

    stubs.connectionStub.createConnection(connectionRequest, function(err, connectionReply) {
      if (err) {
        console.log(err);
      }
      else {
        return;
      }
    });

    link.addListener({
      selectionChanged: function(event) {
        link.togglePopover(event, that.parent);
      }
    });

    return link;
  }
}

module.exports = NotePortModel;
