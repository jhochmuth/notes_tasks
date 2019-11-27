const React = require('react');
const stubs = require('../stubs.js');
import {PortWidget} from '@projectstorm/react-diagrams';
import {Button, Form, FormGroup, Input, Label, Popover, PopoverBody, PopoverHeader, UncontrolledTooltip} from 'reactstrap';

const shapeSettings = {
  rectangle: 15,
  circle: "50%"
}

class NoteWidget extends React.Component {
  constructor(props) {
    super(props);
    this.state = {attrs: this.props.node.content.attrs, displayAttrs: false, width: 200, showAttrForm: false, borderRadius: "15px"};
    this.toggleAttrs = this.toggleAttrs.bind(this);
    this.toggleEditNote = this.toggleEditNote.bind(this);
    this.editNoteAttr = this.editNoteAttr.bind(this);
    this.deleteNote = this.deleteNote.bind(this);
  }

  toggleAttrs() {
    const newState = Object.assign({}, this.state);
    newState.displayAttrs = !this.state.displayAttrs;
    this.setState(newState);
  }

  toggleEditNote() {
    const newState = Object.assign({}, this.state);
    newState.showAttrForm = !newState.showAttrForm;
    this.setState(newState);
  }

  editNoteAttr(event) {
    const obj = this;
    const attr = event.target.attr.value;
    const val = event.target.val.value;
    event.preventDefault();

    if (attr =="shape") {
      const newState = Object.assign({}, this.state);
      newState.borderRadius = shapeSettings[val];
      this.setState(newState);
    }

    const updateAttrRequest = {
      note_id: this.props.node.content.id,
      attr: attr,
      new_value: val
    }

    stubs.noteStub.updateNoteAttr(updateAttrRequest, function(err, noteReply) {
      if (err) {
        console.log(err);
      }

      else {
        const attrs = Object.assign({}, obj.state.attrs);
        const newState = Object.assign({}, obj.state);
        attrs[attr] = val;
        newState.attrs = attrs;
        obj.setState(newState);
      }
    })
  }

  renderAttrs() {
    const attrs = this.state.attrs;
    const obj = this;
    let idDigit = 0;

    return Object.keys(attrs).map(function(attr) {
      if (attr == 'title' || attr == 'text') {
        return null;
      }
      else {
        idDigit += 1;
        return (
            <div key={attr} id={"note" + obj.props.node.content.id + "attr" + idDigit}>
              <span className="attr-text">
                <b>{attr}:</b> {attrs[attr]}
              </span>
              <UncontrolledTooltip placement="right" target={"note" + obj.props.node.content.id + "attr" + idDigit} delay={{show: 1000, hide: 0}}>{attrs[attr]}</UncontrolledTooltip>
            </div>
        );
      }
    })
  }

  deleteNote() {
    let obj = this;
    let noteRequest = {id: this.props.node.content.id};

    stubs.noteStub.deleteNote(noteRequest, function(err, response) {
      if (err) {
        console.log(err);
      }

      else {
        if (response.val) {
          obj.props.node.model.removeNode(obj.props.node);
          obj.props.node.app.forceUpdate();
        }
      }
    })
  }

  render() {
    const attrs = this.state.attrs;
    const height = this.state.displayAttrs ? 100 + (25 * (Object.keys(this.state.attrs).length - 1)) : 80;
    return (
      <div className="note" style={{height: height, width: this.state.width, borderRadius: this.state.borderRadius}}>
        <h3 className="note-title">{attrs.title}</h3>
        <div style={{textAlign: "center", visibility: this.state.displayAttrs ? "visible" : "hidden"}}>{attrs.text}</div>
        <div style={{visibility: this.state.displayAttrs ? "visible" : "hidden", margin: 10}}>{this.renderAttrs()}</div>
        <button id={"attrFormControl" + this.props.node.content.id} className="edit-note-button" onClick={this.toggleEditNote}>⚙</button>
        <button className="toggle-note-display-button" onClick={this.toggleAttrs}>{this.state.displayAttrs ? "⤒" : "⤓"}</button>
        <Button close className="delete-note-button" style={{color: "red"}} onClick={this.deleteNote}/>
        <Popover placement="right" trigger="legacy" target={"attrFormControl" + this.props.node.content.id} isOpen={this.state.showAttrForm} toggle={this.toggleEditNote}>
          <PopoverHeader>Edit note</PopoverHeader>
          <PopoverBody>
            <Form onSubmit={this.editNoteAttr}>
              <FormGroup>
                <Label for={"attrForm" + this.props.node.content.id}>Attribute name</Label>
                <Input type="textarea" name="attr" id={"attrForm" + this.props.node.content.id} />
              </FormGroup>
              <FormGroup>
                <Label>Attribute value</Label>
                <Input type="textarea" name="val" id={"valForm" + this.props.node.content.id} />
              </FormGroup>
              <Button>Submit</Button>
            </Form>
          </PopoverBody>
        </Popover>
        <div style={{position: "absolute", bottom: 0, border: "solid"}}>
          <PortWidget name="bottom" node={this.props.node}/>
        </div>
        <div style={{position: "absolute", bottom: 0, left: 25, border: "solid"}}>
          <PortWidget name="left" node={this.props.node}/>
        </div>
      </div>
    )
  }
}

module.exports = NoteWidget;
