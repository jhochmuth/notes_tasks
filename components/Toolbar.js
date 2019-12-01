const React = require('react');
const stubs = require('../stubs.js');
import {Button, Form, FormGroup, Input, Label, Popover, PopoverBody, PopoverHeader} from 'reactstrap';

class Toolbar extends React.Component {
  constructor() {
    super();
    this.state = {title: "Title", text: "Text", displayNoteForm: false, displayLoadForm: false};
    this.createNote = this.createNote.bind(this);
    this.onChange = this.onChange.bind(this);
    this.toggleNoteForm = this.toggleNoteForm.bind(this);
    this.toggleLoadForm = this.toggleLoadForm.bind(this);
  }

  onChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({[name]: value});
  }

  createNote(event) {
    event.preventDefault();
    if (!event.target.title.value) {
      alert('You must specify at least a title for all notes.')
      return;
    }
    const obj = this;
    const attrs = {title: event.target.title.value, text: event.target.text.value};
    const noteRequest = {attrs: attrs};

    stubs.noteStub.createNote(noteRequest, function(err, noteResponse) {
      if (err) {
        console.log(err);
      }
      else {
        obj.props.createNote(noteResponse);
      }
    });

    const newState = Object.assign({}, this.state);
    newState.toggleNoteForm = false;
    this.setState(newState);
  }

  toggleNoteForm() {
    const newState = Object.assign({}, this.state);
    newState.displayNoteForm = !this.state.displayNoteForm;
    this.setState(newState);
  }

  toggleLoadForm() {
    const newState = Object.assign({}, this.state);
    newState.displayLoadForm = !this.state.displayLoadForm;
    this.setState(newState);
  }

  render() {
    return (
      <div>
        <Button id="noteFormButton" className="toolbar-button" color="secondary" style={{left: 20}} onClick={this.toggleNoteForm}>
          <img src="/home/julius/notes_tasks/icons/note.png" className="toolbar-icon" />
        </Button>
        <Button id="linkButton" className="toolbar-button" color="secondary" style={{left: 40}}>
          <img src="/home/julius/notes_tasks/icons/link.png" className="toolbar-icon" />
        </Button>
        <Button id="saveButton" className="toolbar-button" style={{left: 60}} onClick={this.props.save}>
          <img src="/home/julius/notes_tasks/icons/save.png" className="toolbar-icon" />
        </Button>
        <Button id="loadButton" className="toolbar-button" style={{left: 80}} onClick={this.toggleLoadForm}>
          <img src="/home/julius/notes_tasks/icons/load.png" className="toolbar-icon" />
        </Button>
        <Popover trigger="legacy" placement="bottom" target="noteFormButton" isOpen={this.state.displayNoteForm} toggle={this.toggleNoteForm}>
          <PopoverHeader>Create new note</PopoverHeader>
          <PopoverBody>
            <Form onSubmit={this.createNote}>
              <FormGroup>
                <Label for={"titleForm"}>Title</Label>
                <Input type="textarea" name="title" id={"titleForm"} />
              </FormGroup>
              <FormGroup>
                <Label>Text</Label>
                <Input type="textarea" name="text" id={"textForm"} />
              </FormGroup>
              <Button>Submit</Button>
            </Form>
          </PopoverBody>
        </Popover>
        <Popover trigger="legacy" placement="bottom" target="loadButton" isOpen={this.state.displayLoadForm} toggle={this.toggleLoadForm}>
          <PopoverHeader>Load diagram from file</PopoverHeader>
          <PopoverBody>
            <Form onSubmit={this.props.load}>
              <Input type="file" name="file" />
              <Button>Submit</Button>
            </Form>
          </PopoverBody>
        </Popover>
      </div>
    )
  }
}

module.exports = Toolbar;
