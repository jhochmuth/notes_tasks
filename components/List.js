const React = require('react');
import {Button, Form, Input, InputGroup, InputGroupAddon, Label, ListGroup, ListGroupItem, ListGroupItemHeading, ListGroupItemText, Popover, PopoverHeader, PopoverBody} from 'reactstrap';
const ipcRenderer = require('electron').ipcRenderer;

// todo: move ipcRenderer creation to appropriate lifecycle method

/*
React component for the list view page.
*/
class List extends React.Component {
  constructor() {
    super();

    this.notes = {};
    this.searchResults = false;
    this.sortAttr = [];
    this.renderedNotes = [];
    this.renderedAttrs = [];

    this.state = {displayAttrs: false, renderedData: null, displaySortInfo: false};
    this.toggleAttrs = this.toggleAttrs.bind(this);
    this.search = this.search.bind(this);
    this.addSortAttr = this.addSortAttr.bind(this);
    this.toggleSortInfo = this.toggleSortInfo.bind(this);

    const that = this;

    ipcRenderer.on('listView', function(event, data) {
      that.notes = data;
      that.updateRenderedData();
    });
  }

  updateRenderedData() {
    const that = this;
    const newRenderedData = [];

    if (that.renderedNotes.length > 0) {
      that.renderedNotes.forEach(function(id) {
        newRenderedData.push(that.notes[id]);
      });
    }

    else {
      for (let id in that.notes) {
        newRenderedData.push(that.notes[id]);
      }
    }

    if (this.sortAttr) {
      newRenderedData.sort(function(a, b) {
        for (let i = 0; i < that.sortAttr.length; i++) {
          if (a.attrs[that.sortAttr[i]] < b.attrs[that.sortAttr[i]]) return -1;
          else if (a.attrs[that.sortAttr[i]] > b.attrs[that.sortAttr[i]]) return 1;
        }
        return 0;
      });
    }

    const newState = Object.assign({}, that.state);
    newState.renderedData = newRenderedData;
    that.setState(newState);
  }

  toggleAttrs() {
    const newState = Object.assign({}, this.state);
    newState.displayAttrs = !newState.displayAttrs;
    this.setState(newState);
  }

  search(event) {
    event.preventDefault();
    const searchTerm = event.currentTarget.search.value;
    const that = this;
    this.renderedNotes = [];

    if (searchTerm.length > 0) {
      that.searchResults = true;

      for (let id in that.notes) {
        let note = that.notes[id];
        for (let attr in note.attrs) {
          if (note.attrs[attr].toLowerCase().includes(searchTerm.toLowerCase())) {
            that.renderedNotes.push(id);
            break;
          }
        }
      }
    }

    else that.searchResults = false;

    this.updateRenderedData();
  }

  toggleSortInfo() {
    const newState = Object.assign({}, this.state);
    newState.displaySortInfo = !newState.displaySortInfo;
    this.setState(newState);
  }

  addSortAttr(event) {
    event.preventDefault();
    this.sortAttr.push(event.target.attr.value);
    this.updateRenderedData();
  }

  deleteSortAttr(deleteAttr) {
    this.sortAttr = this.sortAttr.filter(function(attr) {
      return attr != deleteAttr;
    });

    this.updateRenderedData();
  }

  renderSortAttrs() {
    const that = this;

    return that.sortAttr.map(function(attr) {
      return (
        <div key={attr}>{attr}
          <Button close
            className="delete-sort-attr-button"
            onClick={that.deleteSortAttr.bind(that, attr)}/>
        </div>
      )
    })
  }

  renderNoteAttrs(note) {
    const attrList = [];

    for (let attr in note.attrs) {
      if (attr !== "title" && attr !== "text") {
        attrList.push(<li key={note.id + attr}>{attr}: {note.attrs[attr]}</li>);
      }
    }

    return attrList;
  }

  renderNotes() {
    const that = this;
    if (Object.keys(that.notes).length == 0) return <h3>No notes present in diagram.</h3>

    else if (that.state.renderedData && that.state.renderedData.length > 0) {
      return that.state.renderedData.map(function(note) {
        return (
          <ListGroupItem key={note.id}>
            <ListGroupItemHeading>{note.attrs.title}</ListGroupItemHeading>
            <ListGroupItemText>{note.attrs.text}</ListGroupItemText>
              {that.state.displayAttrs ? <ul>{that.renderNoteAttrs(note)}</ul> : null}
          </ListGroupItem>
        )
      })
    }

    else return <h3>No notes found fulfilling criteria.</h3>
  }

  render() {
    return (
      <div>
        <div className="list-view-toolbar">
          <Button className="toolbar-button"
            onClick={this.toggleAttrs}
            style={{position: "absolute", top: "10%", left: 20}}>
            Show Attrs
          </Button>
          <Button id="sortPopover" className="toolbar-button" style={{position: "absolute", top: "10%", left: "40%"}}>Sort Options</Button>
          <Popover trigger="legacy" placement="bottom" target="sortPopover" isOpen={this.state.displaySortInfo} toggle={this.toggleSortInfo}>
            <PopoverHeader>Attribute sort order</PopoverHeader>
            <PopoverBody>
              {this.renderSortAttrs()}
              <Form onSubmit={this.addSortAttr}>
                <Label>Sort by another attribute</Label>
                <Input type="textarea" name="attr" />
                <Button>Submit</Button>
              </Form>
            </PopoverBody>
          </Popover>
          <Form onChange={this.search}>
            <InputGroup style={{position: "absolute", top: "20%", right: 20, width: "33%"}}>
              <InputGroupAddon addonType="prepend">🔎</InputGroupAddon>
              <Input name="search" />
            </InputGroup>
          </Form>
        </div>
        <ListGroup>
          {this.renderNotes()}
        </ListGroup>
      </div>
    )
  }
}

module.exports = List;
