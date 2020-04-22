const React = require('react');

class DrawerHandle extends React.Component {
 render() {
   return (
     <div className="drawer-handle"
      style={{top: "15%"}}
      onClick={() => this.props.toggleForm()}
    >
      <i className="drawer-handle-icon" />
    </div>
   )
 }
}

module.exports = DrawerHandle;
