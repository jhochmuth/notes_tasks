import {DefaultLinkModel} from '@projectstorm/react-diagrams';
const stubs = require('../stubs.js');

class NoteLinkModel extends DefaultLinkModel {
  constructor() {
    super("note");
    this.color = "black";
  }

  togglePopover(event, note) {
    note.displayLinkPopover(event, this.id);
  }

  setTargetPort(port) {
    super.setTargetPort(port);

    if (port) {
      const connectionRequest = {id: this.id, endpoint_two_id: port.parent.content.id, document_id: port.parent.app.documentId};

      stubs.connectionStub.addEndpoint(connectionRequest, function(err, connectionReply) {
        if (err) {
          console.log(err);
        }
        else {
          return;
        }
      });
    }
  }

  remove() {
    super.remove();

    const connectionRequest = {id: this.id, document_id: this.sourcePort.parent.app.documentId};

    stubs.connectionStub.deleteConnection(connectionRequest, function(err, reply) {
      if (err) {
        console.log(err);
      }
      else {
        return;
      }
    });
  }
}

module.exports = NoteLinkModel;
