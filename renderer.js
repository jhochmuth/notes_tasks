const PROTO_PATH = __dirname + '/tasks.proto';
const grpc = require('grpc');
const protoLoader = require('@grpc/proto-loader');

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
    console.log(response);
    document.getElementById('title').innerHTML = response.attrs.title;
    document.getElementById('text').innerHTML = response.attrs.text;
    document.getElementById('created').innerHTML = response.attrs.date_created;
  }
});
