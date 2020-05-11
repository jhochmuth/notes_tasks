const React = require('react');
const stubs = require('../stubs.js');
const Filter = require('../utils/filter.js');
import {PortWidget} from '@projectstorm/react-diagrams';
import {Button, Form, FormGroup, Input, InputGroup, InputGroupAddon, InputGroupText, Label, Popover, PopoverBody, PopoverHeader, UncontrolledTooltip} from 'reactstrap';
import CKEditor from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import ReactModal from 'react-modal';
import {ChromePicker} from 'react-color';
const ResizableBox = require('react-resizable').ResizableBox;
import ScaleText from 'react-scale-text';
const electron = require('electron');
const remote = electron.remote;


const RESERVED_ATTRS = new Set(["Color", "Text char len", "Text word len", "Date created", "Last updated"]);

// todo: delete prototype functionality, show archetype
// todo: make ability to break archetype relationship
// todo: separate into multiple child components
// todo: create functionality to hide reserved attributes such as text len, prevent deletion
// todo: user can still move diagram by dragging inside of color picker
  // fix by using modal instead of popup
class NoteWidget extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      attrs: this.props.node.content.attrs,
      width: 200,
      height: 80,
      displayData: false,
      displayColorSelector: false,
      displayButtons: false,
      showTextForm: false,
      selected: false,
      prototypeId: this.props.node.content.prototype_id,
      inheritedAttrs: this.props.node.content.inherited_attrs,
      filters: new Set(),
      noteColor: this.props.node.content.attrs.Color
    };

    this.textData = null;
    this.diagramListenerId = null;

    this.props.node.addListener({
      selectionChanged: (event) => this.toggleSelection(event)
    })
  }

  toggleSelection(event) {
    const newState = Object.assign({}, this.state);
    newState.selected = event.isSelected;
    this.setState(newState);
  }

  toggleButtons(val) {
    const newState = Object.assign({}, this.state);
    newState.displayButtons = val;
    this.setState(newState);
  }

  toggleDisplayData(openModal) {
    if (openModal) {
      this.diagramListenerId = this.props.node.model.addListener({
        offsetUpdated: (event) => this.props.node.app.diagramRef.current.stopFiringAction()
      });
    }
    else {
      this.props.node.model.removeListener(this.diagramListenerId);
    }

    const newState = Object.assign({}, this.state);
    newState.displayData = !newState.displayData;
    this.setState(newState);
  }

  toggleColorSelector(openSelector) {
    const newState = Object.assign({}, this.state);
    newState.displayColorSelector = openSelector;
    this.setState(newState);
  }

  updateNoteAttr(event, attr_obj) {
    let attr;
    let val;

    if (event) {
      event.preventDefault();
      attr = event.target.key.value;
      val = event.target.value.value;
    }
    else {
      attr = attr_obj.attr;
      val = attr_obj.val;
    }

    const updateAttrRequest = {
      note_id: this.props.node.content.id,
      attr: attr,
      new_value: val,
      document_id: this.props.node.app.documentId
    }

    if (attr == 'Color' && event) {
      alert('Use the color selector tool to update note color.')
    }
    else if (RESERVED_ATTRS.has(attr) && event) {
      alert('Can not update reserved attributes manually.')
    }
    else this.props.node.app.updateNoteAttr(updateAttrRequest);
  }

  deleteNoteAttr(attr) {
    const that = this;

    if (RESERVED_ATTRS.has(attr)) {
      //add to hidden_attrs state
    }

    const deleteAttrRequest = {
      note_id: this.props.node.content.id,
      attr: attr,
      document_id: this.props.node.app.documentId
    }

    stubs.noteStub.deleteNoteAttr(deleteAttrRequest, function(err, noteReply) {
      if (err) {
        console.log(err);
      }

      else {
        const newState = Object.assign({}, that.state);
        newState.attrs = noteReply.attrs;
        newState.inheritedAttrs = noteReply.inherited_attrs;
        that.setState(newState);
        that.props.node.content.attrs = newState.attrs;
        that.props.node.app.updateTreeView();
      }
    })
  }

  attrDoubleClick(attr, val) {
    if (attr.includes("link")) {
      electron.shell.openExternal(val)
    }
  }

  renderAttrs() {
    if (!this.state.displayData) return null;

    const attrs = this.state.attrs;
    const that = this;
    let idDigit = 0;

    let attrElements = Object.keys(attrs).reduce(function(acc, attr) {
      if (attr != 'title' && attr != 'text') {
        idDigit += 1;
        let isInheritedAttr = that.state.inheritedAttrs.includes(attr);
        let isReservedAttr = RESERVED_ATTRS.has(attr);
        let style = {color: isInheritedAttr ? "red" : (isReservedAttr ? "gray" : "black")};

        acc.push(
          <div
            key={attr}
            id={"note" + that.props.node.content.id + "attr" + idDigit}
            onDoubleClick={that.attrDoubleClick.bind(this, attr, attrs[attr])}
            className="attr"
          >
            <span className="attr-text" style={style}>
              <b>{attr}:</b> {attrs[attr]}
            </span>
            <Button close
              className="delete-attr-button"
              onClick={() => that.deleteNoteAttr(attr)}
            />
          </div>
        );
      }
      return acc;
    }, []);

    return attrElements.sort(function(a, b) {
      if (a.key < b.key) return -1;
      else return 1;
    })
  }

  toggleEditLabel() {
    this.props.node.display = !this.props.node.display;
    this.props.node.selectedLinkId = null;
    this.forceUpdate();
  }

  editLabel(id, event) {
    event.preventDefault();
    const that = this;
    const text = event.target.label.value;

    if (event.target.label.value !== "") {
      const connectionRequest = {id: id, text: text, document_id: this.props.node.app.documentId};

      stubs.connectionStub.createConnection(connectionRequest, function(err, connectionReply) {
        if (err) {
          console.log(err);
        }
        else {
          const link = that.props.node.ports.bottom.links[id];
          link.addLabel(text);
          that.props.node.display = false;
          that.props.node.selectedLinkId = null;
          that.props.node.app.forceUpdate();
        }
      });
    }
  }

  toggleEditText(event) {
    const newState = Object.assign({}, this.state);
    newState.showTextForm = !newState.showTextForm;
    this.setState(newState);
  }

  updateText() {
    const that = this;
    this.updateNoteAttr(null, {attr: "text", val: this.textData});
    that.toggleEditText();
  }

  deleteNote() {
    delete this.props.node.app.noteRefs[this.props.node.id];
    this.props.node.remove();
  }

  lockDiagram() {
    this.props.node.app.diagramRef.current.stopFiringAction();
    this.props.node.model.setLocked();
  }

  unlockDiagram() {
    this.props.node.model.setLocked(false);
  }

  onResize(data) {
    const newState = Object.assign({}, this.state);
    newState.width = data.size.width;
    newState.height = data.size.height;
    this.setState(newState);
  }

  colorSelectorChange(color) {
    this.lockDiagram();
    const newState = Object.assign({}, this.state);
    newState.noteColor = color.hex;
    this.setState(newState);
  }

  colorSelectorChangeFinish(color) {
    this.unlockDiagram();
    const newState = Object.assign({}, this.state);
    newState.noteColor = color.hex;
    this.setState(newState);
    this.updateNoteAttr(null, {attr: "Color", val: color.hex});
  }

  applyFilter(filter) {
    if (filter.doesFilter(this.state.attrs)) {
      const newState = Object.assign({}, this.state);
      newState.filters.add(filter);
      this.setState(newState);
    }
  }

  removeFilter(filter) {
    if (this.state.filters.has(filter)) {
      const newState = Object.assign({}, this.state);
      newState.filters.delete(filter);
      this.setState(newState);
    }
  }

  renderPrototype() {
    if (!this.state.prototypeId) return null;
    else if (!this.props.node.model.nodes[this.state.prototypeId]) return null;

    return (
      <h4>Prototype: {this.props.node.model.nodes[this.state.prototypeId].content.attrs.title}</h4>
    )
  }

  render() {
    const attrs = this.state.attrs;

    const noteDivStyling = {
      zIndex: 5,
      border: this.state.selected ? "lightskyblue solid" : "none",
      width: this.state.width,
      height: this.state.height,
      backgroundColor: this.state.noteColor
    }

    if (this.state.filters.size > 0) return null;

    return (
      <ResizableBox
        width={this.state.width}
        height={this.state.height}
        className="note"
        onResizeStart={() => this.lockDiagram()}
        onResizeStop={() => this.unlockDiagram()}
        onResize={(event, data) => this.onResize(data)}
      >
        <div
          style={noteDivStyling}
          onMouseEnter={() => this.toggleButtons(true)}
          onMouseLeave={() => this.toggleButtons(false)}>
          <ScaleText>
            <p className="note-title">{attrs.title}</p>
          </ScaleText>
          <button
            id={"toggleDisplayData" + this.props.node.content.id}
            className="edit-note-button"
            onClick={() => this.toggleDisplayData(true)}
            style={{visibility: this.state.displayButtons ? "visible" : "hidden"}}>⚙</button>
          <button
            id={"colorButton" + this.props.node.content.id}
            className="color-selector-button"
            style={{visibility: this.state.displayButtons ? "visible" : "hidden"}}
            onClick={() => this.toggleColorSelector(true)}>{String.fromCharCode(55356, 57256)}</button>
          <Button close
            className="delete-note-button"
            style={{
              color: "crimson",
              textShadow: "0px 0px",
              visibility: this.state.displayButtons ? "visible" : "hidden"
            }}
            onClick={() => this.deleteNote()}/>
          <ReactModal
            isOpen={this.state.displayData}
            onAfterOpen={() => this.toggleButtons(false)}
            onRequestClose={() => this.toggleDisplayData(false)}
            style={{
              content: {
                backgroundColor: "#F5F5F5",
                left: "60%",
                width: "36%"
              }
            }}
            ariaHideApp={false}
          >
            <h2 className="note-data-title">{attrs.title}</h2>
            <h4 style={{marginTop: 10}}>Attributes</h4>
            <div>{this.renderAttrs()}</div>
            <Form
              className="attr-form"
              onSubmit={(event) => this.updateNoteAttr(event)}
            >
              <h5>Create new attribute</h5>
              <InputGroup className="attr-form-group">
                <InputGroupAddon addonType="prepend" className="attr-form-label">
                  <InputGroupText className="attr-form-text">Attr</InputGroupText>
                </InputGroupAddon>
                <Input name="key" className="attr-form-input"/>
              </InputGroup>
              <InputGroup className="attr-form-group">
                <InputGroupAddon addonType="prepend" className="attr-form-label">
                  <InputGroupText className="attr-form-text">Value</InputGroupText>
                </InputGroupAddon>
                <Input name="value" className="attr-form-input"/>
              </InputGroup>
              <Button>Add</Button>
            </Form>
            <Button
              className="edit-text-button"
              onClick={() => this.toggleEditText()}
            >Edit Text</Button>
            <Button
              className="protoype-button"
              onClick={() => this.props.node.app.createDescendantNote(this.props.node.id)}
            >Create Descendant</Button>
            {this.renderPrototype()}
          </ReactModal>
          <ReactModal
            isOpen={this.state.showTextForm}
            onRequestClose={() => this.toggleEditText()}
            style={{
              content: {
                backgroundColor: "#F5F5F5"
              }
            }}
            ariaHideApp={false}
          >
            <CKEditor
              editor={ClassicEditor}
              onInit={(editor) => {
                this.textData = editor.getData();
              }}
              onChange={(event, editor) => {
                this.textData = editor.getData();
              }}
              data={attrs.text}
            />
            <Button
              className="text-form-submit-button"
              onClick={() => {this.updateText()}}
            >Save</Button>
            <Button
              className="text-form-cancel-button"
              onClick={() => this.toggleEditText()}
            >Cancel</Button>
          </ReactModal>
          <button
            id={"textEditControl" + this.props.node.content.id}
            className="edit-text-button"
            onClick={() => this.toggleEditText()}
            style={{visibility: this.state.displayAttrs ? "visible" : "hidden"}}
          >Edit</button>
          <div id={"port" + this.props.node.content.id}
            style={{position: "absolute", top: 3, left: 3}}>
            <PortWidget name="bottom" node={this.props.node} />
          </div>
          <Popover placement="left"
            trigger="legacy"
            isOpen={this.state.displayColorSelector}
            target={"colorButton" + this.props.node.content.id}
            toggle={() => this.toggleColorSelector(false)}>
            <PopoverBody>
              <ChromePicker
                color={this.state.noteColor}
                onChange={(color) => this.colorSelectorChange(color)}
                onChangeComplete={(color) => this.colorSelectorChangeFinish(color)}
              />
            </PopoverBody>
          </Popover>
          <ReactModal
            isOpen={this.props.node.display}
            onRequestClose={() => this.toggleEditLabel()}
            style={{
              content: {
                backgroundColor: "#F5F5F5",
                height: "40%",
                width: "40%"
              }
            }}
            ariaHideApp={false}
          >
            <Form onSubmit={(event) => this.editLabel(this.props.node.selectedLinkId, event)}>
              <InputGroup className="attr-form-group">
                <InputGroupAddon addonType="prepend" className="attr-form-label">
                  <InputGroupText className="attr-form-text">Label</InputGroupText>
                </InputGroupAddon>
                <Input name="label" className="attr-form-input"/>
              </InputGroup>
              <Button className="app-button">Submit</Button>
              <Button className="app-button" onClick={() => this.toggleEditLabel()}>Cancel</Button>
            </Form>
          </ReactModal>
        </div>
      </ResizableBox>
    )
  }
}

module.exports = NoteWidget;
