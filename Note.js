const React = require('react');

let mainStyle = {
  borderStyle: "solid",
  height: "300px",
  width: "300px",
  left: "150px",
  top: "150px",
  position: "relative"
}

let titleStyle = {
  textAlign: "center"
}

let textStyle = {
  margin: "10px"
}

class Note extends React.Component {
  constructor(props) {
    super();
    this.state = {attrs: props.noteData.attrs}
  }

  render() {
    return (
      <div style={mainStyle}>
        <h3 style={titleStyle}>{this.state.attrs.title}</h3>
        <p style={textStyle}>{this.state.attrs.text}</p>
        <ul>
          <li>Created: {this.state.attrs.date_created}</li>
        </ul>
      </div>
    )
  }

}

module.exports = Note;
