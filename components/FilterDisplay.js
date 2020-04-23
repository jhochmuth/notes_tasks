const React = require('react');
const DrawerHandle = require('./DrawerHandle.js');
const Archetype = require('./Archetype.js');
const stubs = require('../stubs.js');
import {Button, Popover, Form, Input, InputGroupAddon, InputGroupText, InputGroup} from 'reactstrap';
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
      archetypes: [],
      displayArchetypeCreation: false
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
    event.preventDefault();
    const that = this;

    const archetypeRequest = {
      name: event.target.name.value,
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
        />
        const newState = Object.assign({}, that.state);
        newState.archetypes.push(
          <Menu.Item key={reply.id}>
            {archetype}
          </Menu.Item>);
        that.setState(newState);
      }
    })
  }

  toggle() {
    const newState = Object.assign({}, this.state);
    newState.open = !newState.open;
    this.setState(newState);
  }

  toggleArchetypeCreation() {
    const newState = Object.assign({}, this.state);
    newState.displayArchetypeCreation = !newState.displayArchetypeCreation;
    this.setState(newState);
  }

  render() {
    return (
      <Drawer width="20%"
        handler={<DrawerHandle toggleForm={() => this.toggle()}/>}
        open={this.state.open}
        onClose={() => this.toggle()}
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
        <Button
          onClick={() => this.toggleArchetypeCreation()}
          id="archetype-button"
        >Create archetype</Button>
        <Popover
          trigger="legacy"
          placement="top"
          target="archetype-button"
          isOpen={this.state.displayArchetypeCreation}
          toggle={() => this.toggleArchetypeCreation()}
        >
          <Form onSubmit={(event) => this.createArchetype(event)}>
            <InputGroup className="attr-form-group">
              <InputGroupAddon addonType="prepend" className="attr-form-label">
                <InputGroupText className="attr-form-text">Name</InputGroupText>
              </InputGroupAddon>
              <Input name="name" className="attr-form-input"/>
            </InputGroup>
            <Button className="app-button">Submit</Button>
          </Form>
        </Popover>
      </Drawer>
    )
  }
}

module.exports = FilterDisplay;
