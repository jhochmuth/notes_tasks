const React = require('react');
const Resizable = require('re-resizable').Resizable;
const clickdrag = require('react-clickdrag');
const stubs = require('./stubs.js')

class NoteAttrUpdateForm extends React.Component {
  constructor(props) {
    super();
    this.state = {
      key: "Key",
      value: "Value",
      hidden: true
    }

    this.onSubmit = this.onSubmit.bind(this);
    this.onChange = this.onChange.bind(this);
    this.showForm = this.showForm.bind(this);
  }

  onChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({[name]: value});
  }

  onSubmit(event) {
    let obj = this;
    event.preventDefault();

    let updateAttrRequest = {
      note_id: this.props.noteId,
      attr: this.state.key,
      new_value: this.state.value
    }

    stubs.noteStub.updateNoteAttr(updateAttrRequest, function(err, noteReply) {
      if (err) {
        console.log(err);
      }
      else {
        obj.props.onSubmit(noteReply);
      }
    })

    this.setState({key: "Key", value: "Value", hidden: true})
  }

  showForm(event) {
    event.preventDefault();
    this.setState({key: "Key", value: "Value", hidden: false})
  }

  render() {
    let formStyle = {visibility: this.state.hidden ? "hidden" : "visible"};
    let buttonStyle = {visibility: this.state.hidden ? "visible" : "hidden"};

    return (
      <div>
        <button onClick={this.showForm} style={buttonStyle}>Add/Edit Attributes</button>
        <form onSubmit={this.onSubmit} style={formStyle}>
          <input type="text" name="key" onChange={this.onChange} value={this.state.key} />
          <input type="text" name="value" onChange={this.onChange} value={this.state.value} />
          <br />
          <input variant="primary" type="submit" value="Submit" />
        </form>
      </div>
    )
  }
}

class Note extends React.Component {
  constructor(props) {
    super();

    this.state = {
      attrs: props.noteData.attrs,
      lastPositionX: 250,
      lastPositionY: 50,
      currentX: 250,
      currentY: 50
    }

    this.updateAttr = this.updateAttr.bind(this);
    this.deleteAttr = this.deleteAttr.bind(this);
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

  deleteAttr(attr, event) {
    let obj = this;
    event.preventDefault();

    let deleteAttrRequest = {
      note_id: this.props.id,
      attr: attr
    }

    stubs.noteStub.deleteNoteAttr(deleteAttrRequest, function(err, response) {
      if (err) {
        console.log(err)
      }

      else {
        if (response.val) {
          let attrs = Object.assign({}, obj.state.attrs);
          let newState = Object.assign({}, obj.state);
          delete attrs[attr];
          newState.attrs = attrs;

          obj.setState(newState);
        }
      }
    })
  }

  renderAttrs() {
    let listStyle = {
      display: "grid",
      gridTemplateColumns: "90% 10%"
    }

    let textStyle = {
      display: "block",
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
      gridColumnStart: 1,
      gridColumnEnd: "span 1"
    }

    let buttonStyle = {
      gridColumnStart: 2,
      gridColumnEnd: "span 1"
    }

    let obj = this;

    return Object.keys(obj.state.attrs).map(function(x) {
      if (x == 'title' || x == 'text') {
        return null;
      }
      else {
        return (
          <li key={x} style={listStyle}>
            <span style={textStyle}>
              {x}: {obj.state.attrs[x]}
            </span>
            <button style={buttonStyle} onClick={obj.deleteAttr.bind(obj, x)}>✖</button>
          </li>
        );
      }
    })
  }

  updateAttr(noteReply) {
    let newKey = Object.keys(noteReply.attrs)[0];
    let newVal = noteReply.attrs[newKey];
    let newState = Object.assign({}, this.state);
    newState.attrs = Object.assign({}, this.state.attrs);
    newState.attrs[newKey] = newVal;
    this.setState(newState);
  }

  render() {
    let translation = 'translate('+this.state.currentX+'px, '+this.state.currentY+'px)';

    let mainStyle = {
      borderStyle: "solid",
      position: "relative",
      transform: [translation],
      backgroundColor: "white"
    }

    let titleStyle = {
      textAlign: "center"
    }

    let textStyle = {
      margin: "10px"
    }

    return (
      <Resizable style={mainStyle} size={{width: 300, height: 300}}>
        <h3 style={titleStyle}>{this.state.attrs.title}</h3>
        <p style={textStyle}>{this.state.attrs.text}</p>
        <ul>{this.renderAttrs()}</ul>
        <NoteAttrUpdateForm style={{margin: "10px"}} noteId={this.props.id} onSubmit={this.updateAttr} />
      </Resizable>
    )
  }

}

var NoteClickDrag = clickdrag.default(Note, {touch: true});

module.exports = NoteClickDrag;
