const React = require('react');
import {DefaultLinkWidget, DefaultLabelModel} from '@projectstorm/react-diagrams';
import {Popover} from 'reactstrap';

class NoteLinkWidget extends DefaultLinkWidget {
  constructor(props) {
    super(props);
    this.state = {selected: false}
  }
}


module.exports = NoteLinkWidget;
