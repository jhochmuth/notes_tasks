import grpc

import tasks_pb2
import tasks_pb2_grpc


def run():
    with grpc.insecure_channel("localhost:50051") as channel:
        stub = tasks_pb2_grpc.NoteManagerStub(channel)
        response = stub.CreateNote(tasks_pb2.NoteRequest(attrs={"title": "blah", "text": "blahblah"}))
    print(response.attrs["title"])


run()
