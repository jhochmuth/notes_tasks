const React = require('react');
const ReactDOM = require('react-dom');
require('@babel/register');
const TreeView = require('./components/TreeView.js');

treeView = React.createElement(TreeView, null, null);
ReactDOM.render(treeView, document.getElementById('app'));
