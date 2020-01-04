const React = require('react');
const stubs = require('../stubs.js');
import {Button, Form, FormGroup, Input, Label, Popover, PopoverBody, PopoverHeader} from 'reactstrap';

/*
React component for the toolbar of the main app page.
*/
class Toolbar extends React.Component {
  constructor() {
    super();
    this.state = {title: "Title", text: "Text", displayNoteForm: false, displayLoadForm: false};
    this.addNote = this.addNote.bind(this);
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

  addNote(event) {
    event.preventDefault();

    if (!event.target.title.value) {
      alert('You must specify at least a title for all notes.')
      return;
    }

    this.props.addNote(event);

    this.toggleNoteForm();
  }

  toggleNoteForm() {
    const newState = Object.assign({}, this.state);
    newState.displayNoteForm = !this.state.displayNoteForm;
    this.setState(newState);
  }

  render() {
    return (
      <div>
        <Button id="noteFormButton" className="toolbar-button" color="secondary" style={{left: '3%'}} onClick={this.toggleNoteForm}>
          <img src="/home/julius/notes_tasks/icons/note.png" className="toolbar-icon" />
        </Button>
        <Button id="saveButton" className="toolbar-button" style={{left: '80%'}} onClick={this.props.save}>
          <img src="/home/julius/notes_tasks/icons/save.png" className="toolbar-icon" />
        </Button>
        <Button id="loadButton" className="toolbar-button" style={{left: '82%'}} onClick={this.props.load}>
          <img src="/home/julius/notes_tasks/icons/load.png" className="toolbar-icon" />
        </Button>
        <Button className="toolbar-button" style={{left: '5%'}} onClick={this.props.openListView}>
          <img src="/home/julius/notes_tasks/icons/list.png" className="toolbar-icon" />
        </Button>
        <Popover trigger="legacy" placement="bottom" target="noteFormButton" isOpen={this.state.displayNoteForm} toggle={this.toggleNoteForm}>
          <PopoverHeader>Create new note</PopoverHeader>
          <PopoverBody>
            <Form onSubmit={this.addNote}>
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

/*
For Later use:
<Button className="toolbar-button" style={{left: '10%'}} onClick={this.props.addContainer}>
  Container
</Button>
*/
