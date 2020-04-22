const React = require('react');
const DrawerHandle = require('./DrawerHandle.js');
const Archetype = require('./Archetype.js');
const stubs = require('../stubs.js');
import {Button} from 'reactstrap';
import Drawer from 'rc-drawer';
import {Menu} from 'antd';
import {MinusCircleOutlined, PartitionOutlined} from '@ant-design/icons';


class FilterDisplay extends React.Component {
  constructor(props) {
    super(props);

    this.documentId = this.props.documentId;

    this.state = {
      filters: this.props.filters,
      open: false,
      archetypes: []
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
    let key = 1;
    return this.state.filters.reduce(function(acc, filter) {
      let filterElement = (
        <Menu.Item key={key}>
          {filter.attr} {filter.value}
          <Button close
            onClick={() => that.props.deleteFilter(filter)}
            className="filter-list-el-close"
          />
        </Menu.Item>
      )
      acc.push(filterElement)
      key += 1;
      return acc;
    }, []);
  }

  createArchetype() {
    const that = this;

    const attrs = {type: "blah"}

    const archetypeRequest = {
      attrs: attrs,
      name: "blah",
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
          key={reply.id}
          toggleForm={() => that.toggleForm()}
        />
        const newState = Object.assign({}, that.state);
        newState.archetypes.push(archetype);
        that.setState(newState);
      }
    })
  }

  toggleForm() {
    const newState = Object.assign({}, this.state);
    newState.open = !newState.open;
    this.setState(newState);
  }

  render() {
    return (
      <Drawer width="20%"
        handler={<DrawerHandle toggleForm={() => this.toggleForm()}/>}
        open={this.state.open}
        onClose={() => this.toggleForm()}
      >
        <Menu mode="inline" selectable={false}>
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
          {this.state.archetypes}
          </Menu.SubMenu>
        </Menu>
        <Button onClick={() => this.createArchetype()}>Create archetype</Button>
      </Drawer>
    )
  }
}

module.exports = FilterDisplay;
