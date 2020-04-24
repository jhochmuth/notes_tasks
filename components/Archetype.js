const React = require('react');
import {Menu} from 'antd';


class Archetype extends React.Component {
  constructor(props) {
    super(props)
    this.state = {name: props.name, attrs: props.attrs, id: props.id};
  }

  render() {
    return (
      <div
        draggable={true}
        onDragStart={(event) => {
          this.props.toggle();
          event.dataTransfer.setData("create-from-archetype", JSON.stringify(this.state));
        }}
        onDoubleClick={() => this.props.doubleClick(this.state.id, this.state.name)}
      >
        <span>{this.state.name}</span>
      </div>
    )
  }
}

module.exports = Archetype;
