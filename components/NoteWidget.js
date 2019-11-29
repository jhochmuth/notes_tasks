const React = require('react');
const stubs = require('../stubs.js');
import {PortWidget} from '@projectstorm/react-diagrams';
import {Button, Form, FormGroup, Input, Label, Popover, PopoverBody, PopoverHeader, UncontrolledTooltip} from 'reactstrap';

const shapeSettings = {
  rectangle: 15,
  circle: "50%"
}

// TODO: send connection information to backend.
class NoteWidget extends React.Component {
  constructor(props) {
    super(props);
    this.state = {attrs: this.props.node.content.attrs, displayAttrs: false, width: 200, showAttrForm: false, borderRadius: "15px"};
    this.toggleAttrs = this.toggleAttrs.bind(this);
    this.toggleEditNote = this.toggleEditNote.bind(this);
    this.editNoteAttr = this.editNoteAttr.bind(this);
    this.toggleEditLabel = this.toggleEditLabel.bind(this);
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
    const that = this;
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
        const attrs = Object.assign({}, that.state.attrs);
        const newState = Object.assign({}, that.state);
        attrs[attr] = val;
        newState.attrs = attrs;
        that.setState(newState);
      }
    })
  }

  renderAttrs() {
    const attrs = this.state.attrs;
    const that = this;
    let idDigit = 0;

    return Object.keys(attrs).map(function(attr) {
      if (attr == 'title' || attr == 'text') {
        return null;
      }
      else {
        idDigit += 1;
        return (
            <div key={attr} id={"note" + that.props.node.content.id + "attr" + idDigit}>
              <span className="attr-text">
                <b>{attr}:</b> {attrs[attr]}
              </span>
              <UncontrolledTooltip placement="right" target={"note" + that.props.node.content.id + "attr" + idDigit} delay={{show: 1000, hide: 0}}>{attrs[attr]}</UncontrolledTooltip>
            </div>
        );
      }
    })
  }

  toggleEditLabel(event) {
    event.preventDefault();
    console.log("blah")
    this.props.node.display = !this.props.node.display;
    this.props.node.app.forceUpdate();
  }

  editLabel(id, event) {
    event.preventDefault();
    const link = this.props.node.ports.bottom.links[id];
    link.addLabel(event.target.label.value);
    //this.props.node.display = false;
    this.props.node.app.forceUpdate();
  }

  deleteNote() {
    const that = this;
    const noteRequest = {id: this.props.node.content.id};

    for (let linkId in this.props.node.ports.bottom.links) {
      this.props.node.ports.bottom.links[linkId].remove();
    }

    stubs.noteStub.deleteNote(noteRequest, function(err, response) {
      if (err) {
        console.log(err);
      }

      else {
        if (response.val) {
          that.props.node.model.removeNode(that.props.node);
          that.props.node.app.forceUpdate();
        }
      }
    })
  }

  render() {
    const attrs = this.state.attrs;
    const height = this.state.displayAttrs ? 100 + (25 * (Object.keys(this.state.attrs).length - 1)) : 80;
    return (
      <div className="note" style={{height: height, width: this.state.width, borderRadius: this.state.borderRadius}}>
        <h4 className="note-title">{attrs.title}</h4>
        <div style={{textAlign: "center", visibility: this.state.displayAttrs ? "visible" : "hidden"}}>{attrs.text}</div>
        <div style={{visibility: this.state.displayAttrs ? "visible" : "hidden", margin: 10}}>{this.renderAttrs()}</div>
        <button id={"attrFormControl" + this.props.node.content.id} className="edit-note-button" onClick={this.toggleEditNote}>⚙</button>
        <button className="toggle-note-display-button" onClick={this.toggleAttrs}>{this.state.displayAttrs ? "⤒" : "⤓"}</button>
        <Button close className="delete-note-button" style={{color: "crimson", textShadow: "0px 0px"}} onClick={this.deleteNote}/>
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
        <div id={"port" + this.props.node.content.id} style={{position: "absolute", top: 3, left: 3}}>
          <PortWidget name="bottom" node={this.props.node} />
        </div>
        <Popover placement="left" target={"port" + this.props.node.content.id} isOpen={this.props.node.display}>
          <PopoverHeader>Add label to link</PopoverHeader>
          <PopoverBody>
            <Form onSubmit={this.editLabel.bind(this, this.props.node.selectedLinkId)}>
              <Input type="textarea" name="label" id={"labelForm" + this.props.node.content.id} />
              <Button>Submit</Button>
            </Form>
          </PopoverBody>
        </Popover>
      </div>
    )
  }
}

module.exports = NoteWidget;