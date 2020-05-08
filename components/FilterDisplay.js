const React = require('react');
const DrawerHandle = require('./DrawerHandle.js');
const Archetype = require('./Archetype.js');
const stubs = require('../stubs.js');
import {Button, Form, FormGroup, Input, InputGroup, Label} from 'reactstrap';
import Drawer from 'rc-drawer';
import {Menu, Popover} from 'antd';
import {MinusCircleOutlined, PartitionOutlined} from '@ant-design/icons';

// todo: add archetype attr delete functionality
class FilterDisplay extends React.Component {
  constructor(props) {
    super(props);

    this.documentId = this.props.documentId;
    this.archetypeId = null;

    this.state = {
      filters: this.props.filters,
      open: false,
      archetypes: {},
    };
  }

  componentDidUpdate(prevProps) {
    if (prevProps.filters.length != this.props.filters.length) {
      const newState = Object.assign({}, this.state);
      newState.filters = this.props.filters;
      this.setState(newState);
    }
  }

  renderFilters() {
    const that = this;

    return this.state.filters.reduce(function(acc, filter) {
      let filterElement = (
        <Menu.Item key={filter.attr + ":" + filter.value}>
          {filter.attr} {filter.value}
          <Button close
            onClick={() => that.props.deleteFilter(filter)}
            className="filter-list-el-close"
          />
        </Menu.Item>
      )
      acc.push(filterElement)
      return acc;
    }, []);
  }

  renderArchetypes() {
    return Object.values(this.state.archetypes).map((archetype) => {
      return (
        <Menu.Item key={archetype.props.id}>
          {archetype}
        </Menu.Item>
      )
    });
  }

  createArchetype() {
    const that = this;

    const archetypeRequest = {
      name: "New archetype",
      document_id: this.documentId
    }

    stubs.noteStub.createArchetype(archetypeRequest, function(err, reply) {
      if (err) {
        console.log(err);
      }
      else {
        const archetype = <Archetype
          name={reply.name}
          attrs={reply.attrs}
          id={reply.id}
          toggle={() => that.toggle()}
          documentId={that.documentId}
          updateInheritors={(request) => that.updateInheritors(request)}
        />

        const newState = Object.assign({}, that.state);
        newState.archetypes[reply.id] = archetype;
        that.setState(newState);
      }
    })
  }

  toggle() {
    const newState = Object.assign({}, this.state);
    newState.open = !newState.open;
    this.setState(newState);
  }

  updateInheritors(request) {
    const that = this;

    let call = stubs.noteStub.updateArchetypeAttr(request)

    call.on('data', function(reply) {
      that.props.updateNoteAttr(reply.id, reply.attrs, reply.inherited_attrs);
    });
  }

  render() {
    return (
      <Drawer width="20%"
        handler={<DrawerHandle toggleForm={() => this.toggle()}/>}
        open={this.state.open}
        onClose={() => this.toggle()}
      >
        <Menu mode="inline" selectable={false} >
          <Menu.SubMenu
            key="subFilters"
            title={
              <span><MinusCircleOutlined />Filters</span>
            }
          >
          {this.renderFilters()}
          </Menu.SubMenu>
          <Menu.SubMenu
            key="subArchetypes"
            title={
              <span><PartitionOutlined />Archetypes</span>
            }
          >
          {this.renderArchetypes()}
          </Menu.SubMenu>
        </Menu>
        <Button onClick={() => this.createArchetype()}>Create archetype</Button>
      </Drawer>
    )
  }
}

module.exports = FilterDisplay;
