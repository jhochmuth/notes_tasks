const React = require('react');
const clickdrag = require('react-clickdrag');

let mainStyle = {
  borderStyle: "solid",
  height: "300px",
  width: "300px",
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
    this.state = {
      attrs: props.noteData.attrs,
      lastPositionX: 0,
      lastPositionY: 0,
      currentX: 0,
      currentY: 0
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.dataDrag.isMoving) {
      this.setState({
        currentX: this.state.lastPositionX + nextProps.dataDrag.moveDeltaX,
        currentY: this.state.lastPositionY + nextProps.dataDrag.moveDeltaY
      });
    }
    else {
      this.setState({
        lastPositionX: this.state.currentX,
        lastPositionY: this.state.currentY
      })
    }
  }

  render() {
    let translation = 'translate('+this.state.currentX+'px, '+this.state.currentY+'px)';

    let mainStyle = {
      borderStyle: "solid",
      height: "300px",
      width: "300px",
      position: "relative",
      transform: [translation]
    }

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

var NoteClickDrag = clickdrag.default(Note, {touch: true});

module.exports = NoteClickDrag;
