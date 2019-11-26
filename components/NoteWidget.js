const React = require('react');
const stubs = require('../stubs.js');
import {PortWidget} from '@projectstorm/react-diagrams';
import {Button, Form, FormGroup, Input, Label, Popover, PopoverBody, PopoverHeader, UncontrolledTooltip} from 'reactstrap';

class NoteWidget extends React.Component {
  constructor(props) {
    super(props);
    this.state = {attrs: this.props.node.content.attrs, displayAttrs: false, width: 200, showAttrForm: false};
    this.toggleAttrs = this.toggleAttrs.bind(this);
    this.toggleEditNote = this.toggleEditNote.bind(this);
    this.editNoteAttr = this.editNoteAttr.bind(this);
  }

  toggleAttrs() {
    const newState = Object.assign({}, this.state);

    if (this.state.displayAttrs) {
      newState.displayAttrs = false;
    }
    else {
      newState.displayAttrs = true;
    }

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

    let textStyle = {
      display: "block",
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
      textAlign: "left",
      //gridColumnStart: 1,
      //gridColumnEnd: "span 1",
    }

    let idDigit = 0;

    return Object.keys(attrs).map(function(attr) {
      if (attr == 'title' || attr == 'text') {
        return null;
      }
      else {
        idDigit += 1;
        return (
            <div key={attr} id={"note" + obj.props.node.content.id + "attr" + idDigit}>
              <span style={textStyle}>
                <b>{attr}:</b> {attrs[attr]}
              </span>
              <UncontrolledTooltip placement="right" target={"note" + obj.props.node.content.id + "attr" + idDigit} delay={{show: 1000, hide: 0}}>{attrs[attr]}</UncontrolledTooltip>
            </div>
        );
      }
    })
  }
  //<button style={buttonStyle} onClick={obj.deleteAttr.bind(obj, attr)}>✖</button>

  render() {
    const attrs = this.state.attrs;
    const height = this.state.displayAttrs ? 100 + (25 * (Object.keys(this.state.attrs).length - 1)) : 80;
    return (
      <div style={{position: "relative", height: height, width: this.state.width, boxShadow: "10px 10px 5px gray", borderRadius: 15, backgroundColor: "#bdcad9", backgroundImage: "linear-gradient(315deg, #bdcad9 0%, #e1dada 74%)"}}>
        <h3 style={{textAlign: "center", fontFamily: "Oswald"}}>{attrs.title}</h3>
        <div style={{textAlign: "center", visibility: this.state.displayAttrs ? "visible" : "hidden"}}>{attrs.text}</div>
        <div style={{visibility: this.state.displayAttrs ? "visible" : "hidden", margin: 10}}>{this.renderAttrs()}</div>
        <button id={"attrFormControl" + this.props.node.content.id} style={{position: "absolute", margin: 10, right: 0, bottom: 0}} onClick={this.toggleEditNote}>⚙</button>
        <button style={{position: "absolute", margin: 10, right: "40%", bottom: 0}} onClick={this.toggleAttrs}>{this.state.displayAttrs ? "⤒" : "⤓"}</button>
        <Popover placement="right" target={"attrFormControl" + this.props.node.content.id} isOpen={this.state.showAttrForm}>
          <PopoverHeader>Edit note</PopoverHeader>
          <PopoverBody>
            <Form onSubmit={this.editNoteAttr}>
              <FormGroup>
                <Label for={"titleForm" + this.props.node.content.id}>Attribute name</Label>
                <Input type="textarea" name="attr" id={"titleForm" + this.props.node.content.id} />
              </FormGroup>
              <FormGroup>
                <Label>Attribute value</Label>
                <Input type="textarea" name="val" id={"attrForm" + this.props.node.content.id} />
              </FormGroup>
              <Button>Submit</Button>
            </Form>
          </PopoverBody>
        </Popover>
        <div style={{position: "absolute", bottom: 0}}>
          <PortWidget name="bottom" node={this.props.node}/>
        </div>
      </div>
    )
  }
}

module.exports = NoteWidget;
