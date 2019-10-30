import grpc

import tasks_pb2
import tasks_pb2_grpc


def run():
    with grpc.insecure_channel("localhost:50051") as channel:
        note_stub = tasks_pb2_grpc.NoteManagerStub(channel)
        container_stub = tasks_pb2_grpc.ContainerManagerStub(channel)
        conditional_stub = tasks_pb2_grpc.ConditionalManagerStub(channel)

        response = note_stub.CreateNote(tasks_pb2.NoteRequest(attrs={"title": "Joseph Conrad",
                                                                     "text": "British author.",
                                                                     "birth": 1857},
                                                              parent_container_id="None"))
        print(response.id, response.attrs["title"], response.attrs["text"])

        response = note_stub.UpdateNoteAttr(tasks_pb2.UpdateAttrRequest(note_id="0",
                                                                        attr="text",
                                                                        new_value="Author of Nostromo."))
        print(response.id, response.attrs["title"], response.attrs["text"])

        response = note_stub.CreateNote(tasks_pb2.NoteRequest(attrs={"title": "Edith Wharton",
                                                                     "text": "American author.",
                                                                     "birth": 1862},
                                                              parent_container_id="None"))

        response = container_stub.CreateContainer(tasks_pb2.ContainerRequest(child_note_ids=["0"]))
        print(response.id, response.child_note_ids)

        response = container_stub.AddNote(tasks_pb2.AddNoteRequest(container_id="2", note_id="1"))
        print(response.id, response.child_note_ids)

        response = conditional_stub.CreateConditional(tasks_pb2.ConditionalRequest(target="1860",
                                                                                   condition="lt",
                                                                                   type="number"))
        print(response.id, response.target, response.condition, response.type)



run()
