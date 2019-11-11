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
const noteStub = new notemanager('localhost:50051', grpc.credentials.createInsecure());

module.exports.noteStub = noteStub;
