const React = require('react');
const DrawerHandle = require('./DrawerHandle.js');
const Archetype = require('./Archetype.js');
const stubs = require('../stubs.js');
import {Button, Form, FormGroup, Input, InputGroup, Label} from 'reactstrap';
import Drawer from 'rc-drawer';
import {Menu} from 'antd';
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
      openArchetypeDrawer: false,
      archetypes: [],
      archetypesAttrsData: {},
      archetypeName: null,
      archetypeAttrs: {}
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
          doubleClick={(id, name) => that.attrDoubleClick(id, name)}
        />

        const newState = Object.assign({}, that.state);

        newState.archetypes.push(
          <Menu.Item key={reply.id}>
            {archetype}
          </Menu.Item>);

        newState.archetypesAttrsData[reply.id] = reply.attrs;

        that.setState(newState);
        that.toggleArchetypeDrawer(reply.id, reply.name, reply.attrs);
      }
    })
  }

  attrDoubleClick(id, name) {
    const attrs = this.state.archetypesAttrsData[id];
    this.toggleArchetypeDrawer(id, name, attrs);
  }

  toggle() {
    const newState = Object.assign({}, this.state);
    newState.open = !newState.open;
    this.setState(newState);
  }

  toggleArchetypeDrawer(id, name, attrs) {
    const newState = Object.assign({}, this.state);
    newState.openArchetypeDrawer = !newState.openArchetypeDrawer;

    if (newState.openArchetypeDrawer === true) {
      this.archetypeId = id;
      newState.archetypeName = name;
      newState.archetypeAttrs = attrs;
    }

    this.setState(newState);
  }

  renderArchetypeAttrs() {
    const that = this;

    if (!this.state.archetypeAttrs || !Object.keys(this.state.archetypeAttrs).length) {
      return <span>No attributes</span>
    }

    const attrs = this.state.archetypeAttrs;

    return Object.keys(attrs).map(function(attr) {
      return (
          <div
          key={attr}
          id={"archetype" + that.state.archetypeName + attr}
          onDoubleClick={() => that.attrDoubleClick(this, attr, attrs[attr])}
          className="attr"
          >
            <span className="attr-text">
              <b>{attr}:</b> {attrs[attr]}
            </span>
            <Button close
              className="delete-attr-button"
              onClick={() => that.deleteArchetypeAttr(attr)}
            />
          </div>
        )
    });
  }

  addAttribute(event) {
    event.preventDefault();

    const that = this;

    const request = {
      archetype_id: this.archetypeId,
      attr: event.target.attr.value,
      val: event.target.val.value,
      document_id: this.documentId
    }

    let call = stubs.noteStub.updateArchetypeAttr(request)

    const newState = Object.assign({}, this.state);
    newState.archetypeAttrs[request.attr] = request.val;
    newState.archetypesAttrsData[this.archetypeId][request.attr] = request.val;
    this.setState(newState);

    call.on('data', function(reply) {
      that.props.updateNoteAttr(reply.note_id, reply.attrs);
    })
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
          {this.state.archetypes}
          </Menu.SubMenu>
        </Menu>
        <Button onClick={() => this.createArchetype()}>Create archetype</Button>
        <Drawer
          width="30%"
          handler={false}
          open={this.state.openArchetypeDrawer}
          onClose={() => this.toggleArchetypeDrawer()}
          placement="left"
        >
          <h3 id="archetype-name">{this.state.archetypeName}</h3>
          <div id="archetype-attrs">
            <h4>Attributes</h4>
            {this.renderArchetypeAttrs()}
            <Form onSubmit={(event) => this.addAttribute(event)}>
              <FormGroup>
                <Label>Attribute</Label>
                <Input name="attr" />
              </FormGroup>
              <FormGroup>
                <Label>Value</Label>
                <Input name="val" />
              </FormGroup>
              <Button>Add attribute</Button>
            </Form>
          </div>
        </Drawer>
      </Drawer>
    )
  }
}

module.exports = FilterDisplay;
