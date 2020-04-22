const React = require('react');
const DrawerHandle = require('./DrawerHandle.js');
import {Button} from 'reactstrap';
import Drawer from 'rc-drawer';
import {Menu} from 'antd';
import {MinusCircleOutlined} from '@ant-design/icons';


class FilterDisplay extends React.Component {
  constructor(props) {
    super(props);

    this.state = {filters: this.props.filters, open: false};
  }

  componentDidUpdate(prevProps) {
    if (prevProps.filters.length != this.props.filters.length) {
      this.setState({filters: this.props.filters});
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
              <span><MinusCircleOutlined /><span>Filters</span></span>
            }
          >
          {this.renderFilters()}
          </Menu.SubMenu>
        </Menu>
      </Drawer>
    )
  }
}

module.exports = FilterDisplay;
