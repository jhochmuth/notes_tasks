const React = require('react');
const stubs = require('../stubs.js');

class ContainerWidget extends React.Component {
  constructor(props) {
    super(props);
  }
  
  render() {
    return (
      <div style={{backgroundColor: "blue", height: 200, width: 200, zIndex: 1}}>
      </div>
    )
  }
}

module.exports = ContainerWidget;
