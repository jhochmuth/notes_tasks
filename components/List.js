const React = require('react');
import {ListGroup, ListGroupItem, ListGroupItemHeading, ListGroupItemText} from 'reactstrap';
const ipcRenderer = require('electron').ipcRenderer;

class List extends React.Component {
  constructor() {
    super();
    this.data = null;
    this.state = {placeholder: 1}
    const that = this;

    ipcRenderer.on('listView', function(event, data) {
      that.data = data;
      that.setState({placeholder: 2})
    });
  }

  renderNoteAttrs(note) {
    const attrList = [];

    for (let attr in note.attrs) {
      if (attr != "title" || attr != "text") {
        attrList.push(<li key={note.id + attr}>{attr}: {note.attrs[attr]}</li>)
      }
    }

    return attrList;
  }

  renderNotes() {
    const that = this;

    if (that.data) {
      return that.data.map(function(note) {
        return (
          <ListGroupItem key={note.id}>
            <ListGroupItemHeading>{note.attrs.title}</ListGroupItemHeading>
              <ul>
                {that.renderNoteAttrs(note)}
              </ul>
          </ListGroupItem>
        )
      })
    }
  }

  render() {
    return (
      <div>
        <div className="list-view-toolbar"></div>
        <ListGroup>
          {this.renderNotes()}
        </ListGroup>
      </div>
    )
  }
}

module.exports = List;
