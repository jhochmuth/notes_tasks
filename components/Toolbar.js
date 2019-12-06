const React = require('react');
const stubs = require('../stubs.js');
import {Button, Form, FormGroup, Input, Label, Popover, PopoverBody, PopoverHeader} from 'reactstrap';

// todo: use electron dialog box for load instead of having react component open it
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

    const newState = Object.assign({}, this.state);
    newState.toggleNoteForm = false;
    this.setState(newState);

    this.props.addNote(event);
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
        <Button id="noteFormButton" className="toolbar-button" color="secondary" style={{left: '3%'}} onClick={this.toggleNoteForm}>
          <img src="/home/julius/notes_tasks/icons/note.png" className="toolbar-icon" />
        </Button>
        <Button id="saveButton" className="toolbar-button" style={{left: '80%'}} onClick={this.props.save}>
          <img src="/home/julius/notes_tasks/icons/save.png" className="toolbar-icon" />
        </Button>
        <Button id="loadButton" className="toolbar-button" style={{left: '82%'}} onClick={this.toggleLoadForm}>
          <img src="/home/julius/notes_tasks/icons/load.png" className="toolbar-icon" />
        </Button>
        <Button className="toolbar-button" style={{left: '5%'}} onClick={this.props.openListView}>List View</Button>
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

/*
<Button id="linkButton" className="toolbar-button" color="secondary" style={{left: 40}} onClick={this.props.createLink}>
  <img src="/home/julius/notes_tasks/icons/link.png" className="toolbar-icon" />
</Button>
*/
