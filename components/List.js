const React = require('react');
import {Button, Input, InputGroup, InputGroupAddon, ListGroup, ListGroupItem, ListGroupItemHeading, ListGroupItemText} from 'reactstrap';
const ipcRenderer = require('electron').ipcRenderer;

class List extends React.Component {
  constructor() {
    super();
    this.data = null;
    this.state = {displayAttrs: true};
    this.toggleAttrs = this.toggleAttrs.bind(this);

    const that = this;

    ipcRenderer.on('listView', function(event, data) {
      that.data = data;
      that.setState({displayAttrs: false});
    });
  }

  renderNoteAttrs(note) {
    const attrList = [];

    for (let attr in note.attrs) {
      if (attr != "title" || attr != "text") {
        attrList.push(<li key={note.id + attr}>{attr}: {note.attrs[attr]}</li>);
      }
    }

    return attrList;
  }

  renderNotes() {
    const that = this;

    if (that.data && that.data.length > 0) {
      return that.data.map(function(note) {
        return (
          <ListGroupItem key={note.id}>
            <ListGroupItemHeading>{note.attrs.title}</ListGroupItemHeading>
              {that.state.displayAttrs ? <ul>{that.renderNoteAttrs(note)}</ul> : null}
          </ListGroupItem>
        )
      })
    }

    else {
      return <h4>No notes present in diagram.</h4>
    }
  }

  toggleAttrs() {
    const newState = Object.assign({}, this.state);
    newState.displayAttrs = !newState.displayAttrs;
    this.setState(newState);
  }

  render() {
    return (
      <div>
        <div className="list-view-toolbar">
          <Button className="toolbar-button" onClick={this.toggleAttrs} style={{position: "absolute", top: "10%", left: 20}}>Show Attrs</Button>
          <InputGroup style={{position: "absolute", top: "20%", right: 20, width: "33%"}}>
            <InputGroupAddon addonType="prepend">🔎</InputGroupAddon>
            <Input/>
          </InputGroup>
        </div>
        <ListGroup>
          {this.renderNotes()}
        </ListGroup>
      </div>
    )
  }
}

module.exports = List;
