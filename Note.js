const React = require('react');
const Resizable = require('re-resizable').Resizable;
const clickdrag = require('react-clickdrag');
const stubs = require('./stubs.js')
/*
class NoteAttrUpdateForm extends React.Component {
  constructor(props) {
    super();
    this.state = {
      key: "Key",
      value: "Value"
    }
  }

  render() {
    return (
      <form onSubmit={this.onSubmit}>
        <input type="text" name="key" onChange={this.onChange} value=this.state.key />
        <input type="text" name="value" onChange={this.onChange} value=this.state.value />
      </form>
    )
  }
}
*/
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

  renderAttrs() {
    let obj = this;
    return Object.keys(obj.state.attrs).map(function(x) {
      if (x == 'title' || x == 'text') {
        return null;
      }
      else {
        return <li>{x}: {obj.state.attrs[x]}</li>;
      }
    })
  }

  render() {
    let translation = 'translate('+this.state.currentX+'px, '+this.state.currentY+'px)';

    let mainStyle = {
      borderStyle: "solid",
      position: "relative",
      transform: [translation]
    }

    return (
      <Resizable style={mainStyle} size={{width: 300, height: 300}}>
        <h3 style={titleStyle}>{this.state.attrs.title}</h3>
        <p style={textStyle}>{this.state.attrs.text}</p>
        <ul>{this.renderAttrs()}</ul>
      </Resizable>
    )
  }

}

var NoteClickDrag = clickdrag.default(Note, {touch: true});

module.exports = NoteClickDrag;
