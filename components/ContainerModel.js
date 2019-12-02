const SRD = require('@projectstorm/react-diagrams');

class ContainerModel extends SRD.NodeModel {
  constructor() {
    super();
    
  }

  render() {
    return (
      <div className="container">
      </div>
    )
  }
}

module.exports = ContainerModel;
