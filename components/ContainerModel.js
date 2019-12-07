const SRD = require('@projectstorm/react-diagrams');

class ContainerModel extends SRD.NodeModel {
  constructor() {
    super("container");
  }
}

module.exports = ContainerModel;
