const React = require('react');
const DrawerHandle = require('./DrawerHandle.js');
const Archetype = require('./Archetype.js');
const stubs = require('../stubs.js');
import Drawer from 'rc-drawer';
import {Button} from 'reactstrap';
import {Menu, Popover} from 'antd';
import {MinusCircleOutlined, ClusterOutlined} from '@ant-design/icons';
import {Toolbar, Provider, themes} from '@fluentui/react-northstar';
import {TextBoxComponent} from '@syncfusion/ej2-react-inputs';
import {ButtonComponent} from '@syncfusion/ej2-react-buttons';

// todo: add archetype attr delete functionality
class DrawerDisplay extends React.Component {
  constructor(props) {
    super(props);

    this.documentId = this.props.documentId;
    this.archetypeId = null;

    this.state = {
      filters: this.props.filters,
      open: false,
      archetypes: {},
      displayFilterDrawer: false
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

  toggleFilterDrawer() {
    const newState = Object.assign({}, this.state);
    newState.displayFilterDrawer = !newState.displayFilterDrawer;
    this.setState(newState);
  }

  addFilter(event) {
    event.preventDefault();
    const attr = event.target.attr.value;
    const val = event.target.val.value;
    event.target.attr.value = "";
    event.target.val.value = "";
    this.toggleFilterDrawer();
    this.props.addFilter(attr, val);
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
        <Provider theme={themes.teams}>
          <Toolbar
            className="toolbar"
            items={[
              {
                icon: <MinusCircleOutlined />,
                onClick: () => this.toggleFilterDrawer(),
                key: 'newFilter'
              },
              {
                icon: <ClusterOutlined />,
                onClick: () => this.createArchetype(),
                key: 'newArchetype'
              },
            ]}
          />
        </Provider>
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
              <span><ClusterOutlined />Archetypes</span>
            }
          >
          {this.renderArchetypes()}
          </Menu.SubMenu>
        </Menu>
        <Drawer width="20%"
          handler={false}
          open={this.state.displayFilterDrawer}
          onClose={() => this.toggleFilterDrawer()}
        >
          <form onSubmit={(event) => this.addFilter(event)}>
            <h4 className="text-centered">Create filter</h4>
            <TextBoxComponent
              placeholder="Attribute"
              name="attr"
              width="80%"
              cssClass="x-centered"
            />
            <TextBoxComponent
              placeholder="Value"
              name="val"
              width="80%"
              cssClass="x-centered"
            />
            <ButtonComponent content="Submit" cssClass="form-submit-button e-success" />
          </form>
        </Drawer>
      </Drawer>
    )
  }
}

module.exports = DrawerDisplay;
