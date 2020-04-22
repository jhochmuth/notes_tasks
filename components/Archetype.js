const React = require('react');


class Archetype extends React.Component {
  constructor(props) {
    super(props)
    this.state = {name: props.name, attrs: props.attrs, id: props.id};
  }

  render() {
    return (
      <div
        className="archetype"
        draggable={true}
        onDragStart={(event) => {
          event.dataTransfer.setData("create-from-archetype", JSON.stringify(this.state));
          this.props.toggleForm();
        }}
      >
        <h3>{this.state.name}</h3>
      </div>
    )
  }
}

module.exports = Archetype;
