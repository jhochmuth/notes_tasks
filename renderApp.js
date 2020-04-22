const React = require('react');
const ReactDOM = require('react-dom');
require('@babel/register');
const App = require('./App.js');
const MainMenu = require('./MainMenu.js');
const stubs = require('./stubs.js');


stubs.documentStub.createDocument(null, function(err, documentReply) {
  if (err) {
    console.log(err);
  }
  else {
    let documentId = documentReply.id;
    app = React.createElement(App, {documentId: documentId}, null);
    ReactDOM.render(app, document.getElementById('app'));
  }
});
