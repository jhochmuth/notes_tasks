const React = require('react');

class MainMenu extends React.Component {
  render() {
    return (
      <div className="mainmenu">
        <img className="mainmenu-icon"/>
        <div className="mainmenu-title">Mindmaps</div>
        <div>Create new mindmap</div>
        <div>Load saved mindmap</div>
      </div>
    )
  }
}

module.exports = MainMenu;
