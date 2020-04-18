const React = require('react');
import {Button} from 'reactstrap';


class FilterDisplay extends React.Component {
  constructor(props) {
    super(props);

    this.state = {filters: this.props.filters};
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
        <div key={key}>{filter.attr} {filter.value}
          <Button close onClick={() => that.props.deleteFilter(filter)}/>
        </div>
      )
      acc.push(filterElement)
      key += 1;
      return acc;
    }, []);
  }

  render() {
    return (
      <div className="filter-display">
        <h4>Filters</h4>
        {this.renderFilters()}
      </div>
    )
  }
}

module.exports = FilterDisplay;
