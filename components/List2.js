const React = require('react');
import {
  Button,
  Form,
  Input,
  InputGroup,
  InputGroupAddon,
  Label,
  ListGroup,
  ListGroupItem,
  ListGroupItemHeading,
  ListGroupItemText,
  Popover,
  PopoverHeader,
  PopoverBody
} from 'reactstrap';
import {TreeViewComponent} from '@syncfusion/ej2-react-navigations';
const ipcRenderer = require('electron').ipcRenderer;

/*
React component for the outline view page.
*/
class List extends React.Component {
  constructor() {
    super();

    this.notes = {};
    this.searchResults = false;
    this.sortAttr = [];
    this.renderedNotes = [];
    this.renderedAttrs = [];
    this.outlineOrder = [];

    this.state = {displayAttrs: false, renderedData: null, displaySortInfo: false};
  }

  componentDidMount() {
    const that = this;
    
    ipcRenderer.on('listView', function(event, data) {
      that.notes = data;
      that.updateRenderedData();
    });
  }

  createHierarchy(notes, order, pid, next_id) {
    const that = this;

    if (order.length == 0) {
      let data = []
      notes.forEach((note) => {
        data.push({content: note.attrs.title, id: next_id, pid: pid})
        next_id += 1;
      })
      return {next_id: next_id, data: data};
    }

    let sortAttr = order[0];
    let hierarchy = {};
    notes.forEach((note) => {
      let sortVal = note.attrs[sortAttr];
      if (sortVal in hierarchy) {
        hierarchy[sortVal].push(note);
      }
      else {
        hierarchy[sortVal] = [note];
      }
    })

    let data = [];
    for (let attr in hierarchy) {
      let obj = {content: attr, id: next_id, pid: pid, hasChild: true};
      let return_obj = that.createHierarchy(hierarchy[attr], order.slice(1), obj.id, next_id + 1);
      next_id = return_obj.next_id;
      data.push(...return_obj.data);
      data.push(obj);
    }

    return {next_id: next_id, data: data};
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
    let notes = [
      {attrs: {title: "1", type: "Book", subject: "programming"}},
      {attrs: {title: "2", type: "Book", subject: "programming"}},
      {attrs: {title: "3", type: "Article", subject: "programming"}},
      {attrs: {title: "4", type: "Book", subject: "science"}},
      {attrs: {title: "5", type: "Article", subject: "science"}},
    ]
    let returnData = this.createHierarchy(notes, ["type", "subject"], null, 0);
    let fields = {dataSource: returnData.data, id: "id", parentID: "pid", text: "content", hasChildren: "hasChild"};

    return (
      <div>
        <TreeViewComponent fields={fields}/>
      </div>
    )
  }
}

module.exports = List;
