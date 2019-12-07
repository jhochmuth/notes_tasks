const React = require('react');
const SRD = require('@projectstorm/react-diagrams');
const ContainerModel = require('./ContainerModel.js');
const ContainerWidget = require('./ContainerWidget.js');

class ContainerFactory extends SRD.AbstractNodeFactory {
  constructor() {
    super("container");
  }

  generateReactWidget(diagramEngine, node) {
    return <ContainerWidget node={node}/>;
  }

  getNewInstance() {
    return new ContainerModel();
  }
}

module.exports = ContainerFactory;
