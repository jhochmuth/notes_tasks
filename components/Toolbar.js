const React = require('react');
const ReactDOM = require('react-dom');
const stubs = require('../stubs.js');
import {
  Button,
  Form,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Label,
  Popover,
  PopoverBody,
  PopoverHeader
} from 'reactstrap';

/*
React component for the toolbar of the main app page.
*/
class Toolbar extends React.Component {
  constructor() {
    super();

    this.state = {
      title: "Title",
      text: "Text",
      displayNoteForm: false,
      displayFilterForm: false,
      displayLoadForm: false,
      displaySyncPopover: false
    };
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

  addFilter(event) {
    event.preventDefault();

    this.props.addFilter(event);
    this.toggleFilterForm();
  }

  toggleNoteForm() {
    const newState = Object.assign({}, this.state);
    newState.displayNoteForm = !this.state.displayNoteForm;
    this.setState(newState);
  }

  toggleFilterForm() {
    const newState = Object.assign({}, this.state);
    newState.displayFilterForm = !this.state.displayFilterForm;
    this.setState(newState);
  }

  toggleSyncPopover() {
    const newState = Object.assign({}, this.state);
    newState.displaySyncPopover = !this.state.displaySyncPopover;
    this.setState(newState);
  }

  render() {
    return (
      <div>
        <Button
          id="noteFormButton"
          className="toolbar-button"
          color="secondary"
          style={{left: '3%'}}
          onClick={() => this.toggleNoteForm()}
        >
          <img src="../icons/note.png" className="toolbar-icon" />
        </Button>
        <Button
          id="filterFormButton"
          className="toolbar-button"
          style={{left: '10%'}}
          onClick={() => this.toggleFilterForm()}
        >
          Filter
        </Button>
        <Button id="saveButton" className="toolbar-button" style={{left: '80%'}} onClick={this.props.save}>
          <img src="../icons/save.png" className="toolbar-icon" />
        </Button>
        <Button id="loadButton" className="toolbar-button" style={{left: '82%'}} onClick={this.props.load}>
          <img src="../icons/load.png" className="toolbar-icon" />
        </Button>
        <Button className="toolbar-button" style={{left: '5%'}} onClick={this.props.openListView}>
          <img src="../icons/list.png" className="toolbar-icon" />
        </Button>
        <Button
          id="syncFormButton"
          className="toolbar-button"
          style={{left: '15%'}}
          onClick={() => this.toggleSyncPopover()}
        >
          Sync
        </Button>
        <Button
          className="toolbar-button"
          style={{left: '20%'}}
          onClick={() => this.props.uploadToDrive()}
        >
          Upload
        </Button>
        <Button
          className="toolbar-button"
          style={{left: "25%"}}
          onClick={() => this.props.createNoteFromFile()}
        >
          From File
        </Button>
        <Button
          className="toolbar-button"
          style={{left: "30%"}}
          onClick={() => this.props.toggleDriveFiles()}
        >
          Files
        </Button>
        <Popover
          trigger="legacy"
          placement="bottom"
          target="noteFormButton"
          isOpen={this.state.displayNoteForm}
          toggle={() => this.toggleNoteForm()}
        >
          <PopoverHeader>Create new note</PopoverHeader>
          <PopoverBody>
            <Form onSubmit={(event) => this.addNote(event)}>
              <InputGroup className="attr-form-group">
                <InputGroupAddon addonType="prepend" className="attr-form-label">
                  <InputGroupText className="attr-form-text">Title</InputGroupText>
                </InputGroupAddon>
                <Input name="title" className="attr-form-input"/>
              </InputGroup>
              <Button>Submit</Button>
            </Form>
          </PopoverBody>
        </Popover>
        <Popover
          trigger="legacy"
          placement="bottom"
          target="filterFormButton"
          isOpen={this.state.displayFilterForm}
          toggle={() => this.toggleFilterForm()}
        >
          <PopoverHeader>Create new filter</PopoverHeader>
          <PopoverBody>
            <Form onSubmit={(event) => this.addFilter(event)}>
              <InputGroup className="attr-form-group">
                <InputGroupAddon addonType="prepend" className="attr-form-label">
                  <InputGroupText className="attr-form-text">Attribute</InputGroupText>
                </InputGroupAddon>
                <Input name="attr" className="attr-form-input"/>
              </InputGroup>
              <InputGroup className="attr-form-group">
                <InputGroupAddon addonType="prepend" className="attr-form-label">
                  <InputGroupText className="attr-form-text">Value</InputGroupText>
                </InputGroupAddon>
                <Input name="value" className="attr-form-input"/>
              </InputGroup>
              <Button>Submit</Button>
            </Form>
          </PopoverBody>
        </Popover>
        <Popover
          trigger="legacy"
          placement="bottom"
          target="syncFormButton"
          isOpen={this.state.displaySyncPopover}
          toggle={() => this.toggleSyncPopover()}
        >
          <PopoverHeader>Sync with OneDrive</PopoverHeader>
          <PopoverBody>
            <Form onSubmit={(event) => {this.toggleSyncPopover(); this.props.syncOneDrive(event)}}>
              <InputGroup className="attr-form-group">
                <InputGroupAddon addonType="prepend" className="attr-form-label">
                  <InputGroupText className="attr-form-text">Folder ID</InputGroupText>
                </InputGroupAddon>
                <Input name="drive" className="attr-form-input"/>
              </InputGroup>
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