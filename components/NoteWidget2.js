const React = require('react');
const stubs = require('../stubs.js');
import {PortWidget} from '@projectstorm/react-diagrams';
import {Button, Form, FormGroup, Input, Label, Popover, PopoverBody, PopoverHeader, UncontrolledTooltip} from 'reactstrap';
import CKEditor from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import ReactModal from 'react-modal';
const ResizableBox = require('react-resizable').ResizableBox;
const electron = require('electron');
const remote = electron.remote;
const BrowserWindow = remote.BrowserWindow;

const shapeSettings = {
  rectangle: 15,
  circle: "50%"
}

class NoteWidget extends React.Component {
  // todo: refactor attributes into separate component
  constructor(props) {
    super(props);

    this.state = {
      attrs: this.props.node.content.attrs,
      displayAttrs: false,
      width: 200,
      showAttrForm: false,
      borderRadius: "15px",
      showButtons: false,
      showTextForm: false
    };

    this.textData = null;

    this.showButtons = this.showButtons.bind(this);
    this.hideButtons = this.hideButtons.bind(this);
    this.toggleAttrs = this.toggleAttrs.bind(this);
    this.toggleEditNote = this.toggleEditNote.bind(this);
    this.editNoteAttr = this.editNoteAttr.bind(this);
    this.toggleEditLabel = this.toggleEditLabel.bind(this);
    this.toggleEditText = this.toggleEditText.bind(this);
    this.deleteNote = this.deleteNote.bind(this);
  }

  showButtons() {
    const newState = Object.assign({}, this.state);
    newState.showButtons = true;
    this.setState(newState);
  }

  hideButtons() {
    const newState = Object.assign({}, this.state);
    newState.showButtons = false;
    this.setState(newState);
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
      new_value: val,
      document_id: this.props.node.app.documentId
    }

    stubs.noteStub.updateNoteAttr(updateAttrRequest, function(err, noteReply) {
      if (err) {
        console.log(err);
      }

      else {
        const attrs = noteReply.attrs;
        const newState = Object.assign({}, that.state);
        newState.attrs = attrs;
        that.setState(newState);
        that.props.node.content.attrs = attrs;
        that.props.node.app.updateListView();
      }
    })

    this.toggleEditNote();
  }

  attrDoubleClick(attr, val) {
    if (attr === "link") {
      let win = new BrowserWindow({width: 1000, height: 1000, show: false});

      win.on('closed', () => {
        win = null;
      });

      win.loadURL(val);

      win.once('ready-to-show', function() {
        win.webContents.openDevTools();
        win.show();
      });
    }
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
            <div key={attr} id={"note" + that.props.node.content.id + "attr" + idDigit} onDoubleClick={that.attrDoubleClick.bind(this, attr, attrs[attr])}>
              <span className="attr-text">
                <b>{attr}:</b> {attrs[attr]}
              </span>
              <UncontrolledTooltip placement="right"
                target={"note" + that.props.node.content.id + "attr" + idDigit}
                delay={{show: 1000, hide: 0}}>{attrs[attr]}
              </UncontrolledTooltip>
            </div>
        );
      }
    })
  }

  toggleEditLabel(event) {
    event.preventDefault();
    this.props.node.display = !this.props.node.display;
    this.props.node.selectedLinkId = null;
    this.forceUpdate();
  }

  editLabel(id, event) {
    event.preventDefault();
    const that = this;
    const text = event.target.label.value

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

    const updateAttrRequest = {
      note_id: this.props.node.content.id,
      attr: "text",
      new_value: this.textData,
      document_id: this.props.node.app.documentId
    }

    stubs.noteStub.updateNoteAttr(updateAttrRequest, function(err, noteReply) {
      if (err) {
        console.log(err);
      }

      else {
        const attrs = noteReply.attrs;
        const newState = Object.assign({}, that.state);
        newState.attrs = attrs;
        that.setState(newState);
        that.props.node.content.attrs = attrs;
        that.props.node.app.updateListView();
        that.toggleEditText()
      }
    })
  }

  deleteNote() {
    this.props.node.remove();
  }

  onResizeStart() {
    this.props.node.app.diagramRef.current.stopFiringAction()
    this.props.node.model.setLocked()
  }

  onResizeStop() {
    this.props.node.model.setLocked(false)
  }

  render() {
    const attrs = this.state.attrs;
    const height = this.state.displayAttrs ? 100 + (25 * (Object.keys(this.state.attrs).length - 1)) : 80;
    return (
      <ResizableBox
        width={this.state.width}
        height={height}
        className="note"
        onResizeStart={(event, data) => this.onResizeStart()}
        onResizeStop={(event, data) => this.onResizeStop()}>
        <div
          style={{borderRadius: this.state.borderRadius, zIndex: 5}}
          onMouseEnter={this.showButtons}
          onMouseLeave={this.hideButtons}>
          <h4 className="note-title" style={{height: this.state.displayAttrs ? null : "100%"}}>{attrs.title}</h4>
          <div className="note-text" style={{visibility: this.state.displayAttrs ? "visible" : "hidden"}}>{attrs.text}</div>
          <div style={{visibility: this.state.displayAttrs ? "visible" : "hidden", margin: 10}}>{this.renderAttrs()}</div>
          <button id={"attrFormControl" + this.props.node.content.id}
            className="edit-note-button"
            onClick={this.toggleEditNote}
            style={{visibility: this.state.showButtons ? "visible" : "hidden"}}>⚙</button>
          <button className="toggle-note-display-button"
            onClick={this.toggleAttrs}
            style={{visibility: this.state.showButtons ? "visible" : "hidden"}}>{this.state.displayAttrs ? "⤒" : "⤓"}</button>
          <Button close
            className="delete-note-button"
            style={{color: "crimson", textShadow: "0px 0px", visibility: this.state.showButtons ? "visible" : "hidden"}}
            onClick={this.deleteNote}/>
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
                  <Input
                    type="textarea"
                    name="val"
                    id={"valForm" + this.props.node.content.id} />
                </FormGroup>
                <Button>Submit</Button>
              </Form>
            </PopoverBody>
          </Popover>
          <ReactModal
            isOpen={this.state.showTextForm}
            onRequestClose={this.toggleEditText}
            style={{
              content: {
                backgroundColor: "#F5F5F5"
              }
            }}
            ariaHideApp={false}>
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
              onClick={this.toggleEditText}
            >Cancel</Button>
          </ReactModal>
          <button
            id={"textEditControl" + this.props.node.content.id}
            className="edit-text-button"
            onClick={this.toggleEditText}
            style={{visibility: this.state.displayAttrs ? "visible" : "hidden"}}
          >Edit</button>
          <div id={"port" + this.props.node.content.id}
            style={{position: "absolute", top: 3, left: 3}}>
            <PortWidget name="bottom" node={this.props.node} />
          </div>
          <Popover placement="left"
            trigger="legacy"
            target={"port" + this.props.node.content.id}
            isOpen={this.props.node.display}>
            <PopoverHeader>Add label to link</PopoverHeader>
            <PopoverBody>
              <Form onSubmit={this.editLabel.bind(this, this.props.node.selectedLinkId)}>
                <Input type="textarea"
                  name="label"
                  id={"labelForm" + this.props.node.content.id} />
                <Button>Submit</Button>
                <Button onClick={this.toggleEditLabel}>Cancel</Button>
              </Form>
            </PopoverBody>
          </Popover>
        </div>
      </ResizableBox>
    )
  }
}

module.exports = NoteWidget;
