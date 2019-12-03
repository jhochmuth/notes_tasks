const React = require('react');
const ReactDOM = require('react-dom');
require('@babel/register');
const App = require('./App.js');
const MainMenu = require('./MainMenu.js');

mainmenu = React.createElement(MainMenu, null, null);
ReactDOM.render(mainmenu, document.getElementById('app'));
