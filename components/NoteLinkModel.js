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
      const connectionRequest = {id: this.id, endpoint_two_id: port.parent.content.id};

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
}

module.exports = NoteLinkModel;
