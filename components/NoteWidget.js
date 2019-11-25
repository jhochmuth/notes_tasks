const React = require('react');
const SRD = require('@projectstorm/react-diagrams');
import {Button, Form, FormGroup, Input, Label, Popover, PopoverBody, PopoverHeader, UncontrolledTooltip} from 'reactstrap';

class NoteWidget extends React.Component {
  constructor(props) {
    super(props);
    this.state = {displayAttrs: false, height: 125, width: 200, showAttrForm: false};
    this.toggleAttrs = this.toggleAttrs.bind(this);
    this.editNote = this.editNote.bind(this);
  }

  toggleAttrs() {
    const newState = Object.assign({}, this.state);

    if (this.state.displayAttrs) {
      newState.displayAttrs = false;
      newState.height = 125;
    }
    else {
      newState.displayAttrs = true;
      newState.height = 225;
    }

    this.setState(newState);
  }

  editNote() {
    const newState = Object.assign({}, this.state);
    newState.showAttrForm = !newState.showAttrForm;
    this.setState(newState);
  }

  renderAttrs() {
    const attrs = this.props.node.content.attrs;
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
    const attrs = this.props.node.content.attrs;
    return (
      <div style={{position: "relative", height: this.state.height, width: this.state.width, border: "solid", backgroundColor: "white"}}>
        <h3 style={{textAlign: "center"}}>{attrs.title}</h3>
        <div style={{textAlign: "center"}}>{attrs.text}</div>
        <div style={{visibility: this.state.displayAttrs ? "visible" : "hidden", margin: 10}}>{this.renderAttrs()}</div>
        <button id={"attrFormControl" + this.props.node.content.id} style={{position: "absolute", margin: 10, right: 0, bottom: 0}} onClick={this.editNote}>⚙</button>
        <button style={{position: "absolute", margin: 10, right: "40%", bottom: 0}} onClick={this.toggleAttrs}>{this.state.displayAttrs ? "⤒" : "⤓"}</button>
        <Popover placement="right" target={"attrFormControl" + this.props.node.content.id} isOpen={this.state.showAttrForm}>
          <PopoverHeader>Edit note</PopoverHeader>
          <PopoverBody>
            <Form>
              <FormGroup>
                <Label>Attribute name</Label>
                <Input type="textarea" name="title" id={"titleForm" + this.props.node.content.id} />
              </FormGroup>
            </Form>
          </PopoverBody>
        </Popover>
      </div>
    )
  }
}

module.exports = NoteWidget;
