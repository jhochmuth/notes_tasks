const React = require('react');
import {Button} from 'reactstrap';


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
        <div key={key}>
          {filter.attr} {filter.value}
          <Button close
            onClick={() => that.props.deleteFilter(filter)}
            className="filter-list-el-close"
          />
        </div>
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
    if (this.state.open) {
      return (
        <div id="filter-display" className="open">
          <h5
            id="filter-display-label"
            className="open"
            onClick={() => this.toggleForm()}
          >Filters</h5>
          {this.renderFilters()}
        </div>
      )
    }
    else {
      return (
        <div id="filter-display" className="closed">
          <h5
            id="filter-display-label"
            className="closed"
            onClick={() => this.toggleForm()}
          >Filters</h5>
        </div>
      )
    }
  }
}

module.exports = FilterDisplay;
