# flake8: noqa

import grpc

import tasks_pb2
import tasks_pb2_grpc


def run():
    with grpc.insecure_channel("localhost:50051") as channel:
        document_stub = tasks_pb2_grpc.DocumentManagerStub(channel)
        note_stub = tasks_pb2_grpc.NoteManagerStub(channel)
        connection_stub = tasks_pb2_grpc.ConnectionManagerStub(channel)
        container_stub = tasks_pb2_grpc.ContainerManagerStub(channel)
        conditional_stub = tasks_pb2_grpc.ConditionalManagerStub(channel)

        print("Creating document.")
        response = document_stub.CreateDocument(tasks_pb2.Empty())
        document_id = response.id
        print(document_id)

        print("Creating note.")
        response = note_stub.CreateNote(tasks_pb2.NoteRequest(attrs={"title": "Joseph Conrad",
                                                                     "text": "British author.",
                                                                     "birth": "1860"},
                                                              document_id=document_id))
        note1_id = response.id
        print(note1_id, response.attrs["title"], response.attrs["text"])

        print("Creating descendant note.")
        response = note_stub.CreateDescendantNote(tasks_pb2.NoteRequest(id=note1_id,
                                                                        document_id=document_id))
        note2_id = response.id
        print(note2_id)
        print(response.inherited_attrs)

        print("Updating notes using inheritance hierarchy.")
        responses = note_stub.UpdateNoteAttr(tasks_pb2.UpdateAttrRequest(note_id=note1_id,
                                                                         attr="birth",
                                                                         new_value="1857",
                                                                         document_id=document_id))
        for response in responses:
            print(response.id)
            print(response.attrs)


run()
