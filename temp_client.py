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

        print("Creating note.")
        response = note_stub.CreateNote(tasks_pb2.NoteRequest(attrs={"title": "Joseph Conrad",
                                                                     "text": "British author.",
                                                                     "birth": "1857"}))
        print(response.id, response.attrs["title"], response.attrs["text"])

        response = document_stub.SaveDocument(tasks_pb2.Empty())
        print(response)

        """
        print("Updating note.")
        response = note_stub.UpdateNoteAttr(tasks_pb2.UpdateAttrRequest(note_id="0",
                                                                        attr="text",
                                                                        new_value="Author of Nostromo."))
        print(response.id, response.attrs["title"], response.attrs["text"])

        print("Creating note.")
        response = note_stub.CreateNote(tasks_pb2.NoteRequest(attrs={"title": "Edith Wharton",
                                                                     "text": "American author.",
                                                                     "birth": "1862"}))

        print("Creating container.")
        response = container_stub.CreateContainer(tasks_pb2.ContainerRequest(child_note_ids=["0"]))
        print(response.id, response.child_note_ids)

        print("Adding note to container.")
        response = container_stub.AddNote(tasks_pb2.AddNoteRequest(container_id="2", note_id="1"))
        print(response.id, response.child_note_ids)

        print("Creating conditional.")
        response = conditional_stub.CreateConditional(tasks_pb2.ConditionalRequest(target="1860",
                                                                                   condition="lt"))
        print(response.id, response.target, response.condition)

        print("Searching container.")
        response = container_stub.SearchChildNoteAttrs(tasks_pb2.ContainerSearchRequest(container_id="2",
                                                                                        conditional_id="3",
                                                                                        attrs=["birth"]))
        print(response.result)

        print("Removing note from container.")
        response = container_stub.RemoveNote(tasks_pb2.AddNoteRequest(container_id="2", note_id="1"))
        print(response.id, response.child_note_ids)

        print("Creating connection.")
        response = connection_stub.CreateConnection(tasks_pb2.ConnectionRequest(endpoint_one_id="0",
                                                                                endpoint_two_id="1",))
        print(response.endpoint_one_id, response.endpoint_two_id)
        """

run()
