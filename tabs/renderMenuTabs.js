const React = require('react');
const ReactDOM = require('react-dom');
require('@babel/register');
const MainMenu = require('./MainMenuTabs.js');

mainmenu = React.createElement(MainMenu, null, null);
ReactDOM.render(mainmenu, document.getElementById('app'));
