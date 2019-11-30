const React = require('react');
import {DefaultLinkFactory} from '@projectstorm/react-diagrams';
const NoteLinkModel = require('./NoteLinkModel.js');
const NoteLinkWidget = require('./NoteLinkWidget');

class NoteLinkFactory extends DefaultLinkFactory {
  constructor() {
    super();
    this.type = "note";
  }

  generateReactWidget(engine, link) {
    return <NoteLinkWidget link={link} diagramEngine={engine} id="blah"/>;
  }
}

module.exports = NoteLinkFactory;
