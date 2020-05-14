const React = require('react');
import {
  Button,
  Popover,
  PopoverHeader,
  PopoverBody
} from 'reactstrap';
import {TreeViewComponent} from '@syncfusion/ej2-react-navigations';
import {TextBoxComponent} from '@syncfusion/ej2-react-inputs';
import {ButtonComponent} from '@syncfusion/ej2-react-buttons';
import {Input, Provider, Toolbar, themes} from '@fluentui/react-northstar';
import {
  ClusterOutlined,
  MinusCircleOutlined,
  SearchOutlined,
  SortAscendingOutlined
} from '@ant-design/icons';
import Drawer from 'rc-drawer';
const ipcRenderer = require('electron').ipcRenderer;


//todo: optimize updateRenderedData method by splitting into multiple methods and only calling the one that is needed
class TreeView extends React.Component {
  constructor() {
    super();

    this.notes = {};
    this.searchResults = false;
    this.sortAttr = [];
    this.renderedNotes = [];
    this.renderedAttrs = [];

    this.state = {
      hierarchy: [],
      displayAttrs: false,
      renderedData: null,
      displaySortInfo: false,
      displayHierarchyDrawer: false
    };
  }

  componentDidMount() {
    const that = this;
    
    ipcRenderer.on('treeView', function(event, data) {
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
    let newRenderedData = [];

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

    newRenderedData.forEach((note) => {
      note.content = note.attrs.title;
    })

    if (this.sortAttr) {
      newRenderedData.sort(function(a, b) {
        for (let i = 0; i < that.sortAttr.length; i++) {
          if (a.attrs[that.sortAttr[i]] < b.attrs[that.sortAttr[i]]) return -1;
          else if (a.attrs[that.sortAttr[i]] > b.attrs[that.sortAttr[i]]) return 1;
        }
        return 0;
      });
    }

    if (this.state.hierarchy.length > 0) {
      let data = this.createHierarchy(newRenderedData, this.state.hierarchy, null, 0);
      newRenderedData = data.data;
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
    if (!this.sortAttr.includes(event.target.attr.value)) {
      this.sortAttr.push(event.target.attr.value);
      this.updateRenderedData();
      event.target.attr.value = "";
    }
    else alert('You are already sorting by this attribute.');
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

  renderNotes(fields) {
    const that = this;
    if (Object.keys(that.notes).length == 0) return <h3>No notes present in diagram.</h3>

    else if (that.state.renderedData && that.state.renderedData.length > 0) {
      return (
        <TreeViewComponent fields={fields} />
      )
    }

    else return <h3>No notes found fulfilling criteria.</h3>
  }

  renderHierarchy() {
    if (this.state.hierarchy.length == 0) return <p>No hierarchy specified.</p>

    return this.state.hierarchy.map((attr) => {
      return (
        <p key={attr}>{attr}
          <Button close onClick={() => this.deleteFromHierarchy(attr)}/>
        </p>
      )
    })
  }

  addHierarchyAttr(event) {
    event.preventDefault();

    if (!this.state.hierarchy.includes(event.target.attr.value)) {
      const newState = {...this.state};
      newState.hierarchy.push(event.target.attr.value);
      this.setState(newState);
      this.updateRenderedData();
      event.target.attr.value = "";
    }

    else alert('Hierarchy already contains that attribute.');
  }

  deleteFromHierarchy(attr) {
    const newState = {...this.state};
    newState.hierarchy = newState.hierarchy.filter((item) => item !== attr);
    this.setState(newState, () => {
      this.updateRenderedData();
    });
  }

  toggleHierarchyDrawer() {
    const newState = {...this.state};
    newState.displayHierarchyDrawer = !newState.displayHierarchyDrawer;
    this.setState(newState);
  }

  renderSearchBar() {
    return (
      <Input
        icon={<SearchOutlined />}
        placeholder="Search..."
        iconPosition="start"
        name="search"
      />
    )
  }

  render() {
    let fields = {
      dataSource: this.state.renderedData,
      id: "id",
      parentID: "pid",
      text: "content",
      hasChildren: "hasChild"
    };

    return (
      <Provider theme={themes.teams}>
        <Toolbar
          className="toolbar"
          items={[
            {
              icon: <ClusterOutlined />,
              onClick: () => this.toggleHierarchyDrawer(),
              key: 'addLevel'
            },
            {
              icon: <SortAscendingOutlined />,
              onClick: () => this.toggleSortInfo(),
              key: 'showSortInfo',
              id: 'sortButton'
            },
            {
              icon: <MinusCircleOutlined />,
              onClick: () => this.toggleAttrs(),
              key: 'showAttrs UNIMPLEMENTED'
            },
            {
              content: this.renderSearchBar(),
              kind: 'custom',
              key: 'search'
            }
          ]}
        />
        <Popover
          trigger="legacy"
          placement="bottom"
          target="sortButton"
          isOpen={this.state.displaySortInfo}
          toggle={() => this.toggleSortInfo()}
        >
          <PopoverHeader>Attribute sort order</PopoverHeader>
          <PopoverBody>
            {this.renderSortAttrs()}
            <form onSubmit={(event) => this.addSortAttr(event)}>
              <TextBoxComponent
                name="attr"
                placeholder="Add sorting attribute"
                width="80%"
                cssClass="x-centered"
              />
              <ButtonComponent
                content="Submit"
                cssClass="form-submit-button e-success"
              />
            </form>
          </PopoverBody>
        </Popover>
        <Drawer
          width="30%"
          handler={false}
          open={this.state.displayHierarchyDrawer}
          onClose={() => this.toggleHierarchyDrawer()}
          placement="left"
        >
          <div className="left-10">
            <h4>Hierarchy</h4>
            {this.renderHierarchy()}
          </div>
          <form onSubmit={(event) => this.addHierarchyAttr(event)}>
            <TextBoxComponent
              name="attr"
              placeholder="Add hierarchy level"
              width="80%"
              cssClass="x-centered"
            />
            <ButtonComponent
              content="Submit"
              cssClass="form-submit-button e-success"
            />
          </form>
        </Drawer>
        {this.renderNotes(fields)}
      </Provider>
    )
  }
}

module.exports = TreeView;
