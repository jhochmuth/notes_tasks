const PROTO_PATH = __dirname + '/tasks.proto';
const grpc = require('grpc');
const protoLoader = require('@grpc/proto-loader');
const React = require('react');
const ReactDOM = require('react-dom');
require('@babel/register');
const App = require('./App.js')


const packageDefinition = protoLoader.loadSync(
    PROTO_PATH,
    {keepCase: true,
     longs: String,
     enums: String,
     defaults: true,
     oneofs: true
    }
);

const protoDescriptor = grpc.loadPackageDefinition(packageDefinition);
const notemanager = protoDescriptor.NoteManager;
stub = new notemanager('localhost:50051', grpc.credentials.createInsecure());

const attrs = {title: "Joseph Conrad", text: "British author."}
const note = {attrs: attrs};

stub.createNote(note, function(err, response) {
  if (err) {
    console.log(err);
  }

  else {
    var e = React.createElement("div", null, response.attrs.title);
    ReactDOM.render(App(), document.getElementById('title'))
    var e = React.createElement("div", null, response.attrs.text);
    ReactDOM.render(e, document.getElementById('text'))
    document.getElementById('created').innerHTML = response.attrs.date_created;
  }
});
