const React = require('react');
const ReactDOM = require('react-dom');
require('@babel/register');
const List = require('./components/List2.js');

list = React.createElement(List, null, null);
ReactDOM.render(list, document.getElementById('app'));
