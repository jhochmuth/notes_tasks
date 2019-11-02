var PROTO_PATH = __dirname + '/tasks.proto';
var grpc = require('grpc');
var protoLoader = require('@grpc/proto-loader');

var packageDefinition = protoLoader.loadSync(
    PROTO_PATH,
    {keepCase: true,
     longs: String,
     enums: String,
     defaults: true,
     oneofs: true
    }
);
var protoDescriptor = grpc.loadPackageDefinition(packageDefinition);
var routeguide = protoDescriptor.routeguide;

stub = new routeguide.RouteGuide('localhost:50051', grpc.credentials.createInsecure());

let result = document.querySelector('#result')

result.textContent = "123"
var note = stub.CreateNote(title="blah", text="blahblah")

result.textContent = note.title