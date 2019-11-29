import {DefaultLinkModel} from '@projectstorm/react-diagrams';

class NoteLinkModel extends DefaultLinkModel {
  constructor() {
    super("note");
    this.color = "black";
  }

  togglePopover(event, note) {
    note.displayLinkPopover(event, this.id);
  }
}

module.exports = NoteLinkModel;
