const React = require('react');
const ReactDOM = require('react-dom');
require('@babel/register');
const App = require('./App.js');

app = React.createElement(App, null, null);
ReactDOM.render(app, document.getElementById('app'));
