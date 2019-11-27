const React = require('react');
const stubs = require('../stubs.js');
import {Button, Form, FormGroup, Input, Label, Popover, PopoverBody, PopoverHeader} from 'reactstrap';

class Toolbar extends React.Component {
  constructor() {
    super();
    this.state = {title: "Title", text: "Text", displayNoteForm: false};
    this.createNote = this.createNote.bind(this);
    this.onChange = this.onChange.bind(this);
    this.showNoteForm = this.showNoteForm.bind(this);
  }

  onChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({[name]: value});
  }

  createNote(event) {
    event.preventDefault();
    const obj = this;
    const attrs = {title: event.target.title.value, text: event.target.text.value};
    const noteRequest = {attrs: attrs};

    stubs.noteStub.createNote(noteRequest, function(err, noteResponse) {
      if (err) {
        console.log(err);
      }
      else {
        obj.props.onSubmit(noteResponse);
      }
    });

    const newState = Object.assign({}, this.state);
    newState.showNoteForm = false;
    this.setState(newState);
    this.forceUpdate();
  }

  showNoteForm() {
    const newState = Object.assign({}, this.state);
    newState.displayNoteForm = !this.state.displayNoteForm;
    this.setState(newState);
  }

  render() {
    return (
      <div>
        <Button id="noteFormButton" className="toolbar-button" color="secondary" style={{left: 20}} onClick={this.showNoteForm}>
          <img src="/home/julius/notes_tasks/icons/note.png" className="toolbar-icon" />
        </Button>
        <Button id="linkButton" className="toolbar-button" color="secondary" style={{left: 40}}>
          <img src="/home/julius/notes_tasks/icons/link.png" className="toolbar-icon" />
        </Button>
        <Button id="saveButton" className="toolbar-button" style={{left: 60}}>
          <img src="/home/julius/notes_tasks/icons/save.png" className="toolbar-icon" />
        </Button>
        <Popover trigger="focus" placement="bottom" target="noteFormButton" isOpen={this.state.displayNoteForm}>
          <PopoverHeader>Create new note</ PopoverHeader>
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
      </div>
    )
  }
}

module.exports = Toolbar;
