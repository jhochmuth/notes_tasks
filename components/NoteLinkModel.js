import {DefaultLinkModel} from '@projectstorm/react-diagrams';

class NoteLinkModel extends DefaultLinkModel {
  constructor() {
    super("note");
    this.color = "black";
    console.log(this)
  }

  togglePopover(event, note) {
    note.displayLinkPopover(event, this.id);
  }

  setTargetPort(port) {
    super.setTargetPort(port);
    /*
    stubs.connectionStub.createConnection(connectionRequest, function(err, connectionReply) {
      if (err) {
        console.log(err);
      }
      else {
        return;
      }
    });
    */
  }
}

module.exports = NoteLinkModel;
