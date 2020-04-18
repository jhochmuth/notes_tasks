const React = require('react');


class FilterDisplay extends React.Component {
  constructor(props) {
    super(props);

    this.state = {filters: this.props.filters};
  }

  renderFilters() {
    this.state.filters.reduce(function(acc, filter) {
      
    }, [])
  }

  render() {
    return (
      <div className="filter-display">
        {this.renderFilters()}
      </div>
    )
  }
}

module.exports = FilterDisplay;
