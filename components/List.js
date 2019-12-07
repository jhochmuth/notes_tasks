const React = require('react');
import {Button, Form, Input, InputGroup, InputGroupAddon, ListGroup, ListGroupItem, ListGroupItemHeading, ListGroupItemText} from 'reactstrap';
const ipcRenderer = require('electron').ipcRenderer;

class List extends React.Component {
  constructor() {
    super();

    this.notes = {};
    this.searchResults = false;
    this.renderedNotes = new Set();
    this.renderedAttrs = new Set();

    this.state = {displayAttrs: false, renderedData: null};
    this.toggleAttrs = this.toggleAttrs.bind(this);
    this.search = this.search.bind(this);

    const that = this;

    ipcRenderer.on('listView', function(event, data) {
      that.notes = data;

      that.updateRenderedData();
    });
  }

  updateRenderedData() {
    const that = this;
    const newRenderedData = [];

    if (that.searchResults) {
      that.renderedNotes.forEach(function(id) {
        newRenderedData.push(that.notes[id]);
      });
    }

    else {
      for (let id in that.notes) {
        newRenderedData.push(that.notes[id]);
      }
    }

    const newState = Object.assign({}, that.state);
    newState.renderedData = newRenderedData;
    that.setState(newState);
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
              {that.state.displayAttrs ? <ul>{that.renderNoteAttrs(note)}</ul> : null}
          </ListGroupItem>
        )
      })
    }

    else return <h3>No notes found fulfilling criteria.</h3>
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
    this.renderedNotes = new Set();

    if (searchTerm.length > 0) {
      that.searchResults = true;

      for (let id in that.notes) {
        let note = that.notes[id];
        for (let attr in note.attrs) {
          if (note.attrs[attr].toLowerCase().includes(searchTerm.toLowerCase())) {
            that.renderedNotes.add(id);
            break;
          }
        }
      }
    }

    else that.searchResults = false;

    this.updateRenderedData();
  }

  render() {
    return (
      <div>
        <div className="list-view-toolbar">
          <Button className="toolbar-button" onClick={this.toggleAttrs} style={{position: "absolute", top: "10%", left: 20}}>Show Attrs</Button>
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
