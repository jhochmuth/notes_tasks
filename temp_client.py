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

        print("Creating note from gdrive.")
        response = document_stub.CreateNotesFromDrive(tasks_pb2.DriveRequest(document_id=document_id))
        for item in response:
            print(item)
        """

        print("Creating note from file.")
        response = note_stub.CreateNoteFromFile(tasks_pb2.NoteFromFileRequest(document_id=document_id,
                                                                              paths=['/Users/juliushochmuth/Documents/Journals:Other/Manufacturing Consent.pdf']))
        for item in response:
            print(item)
        """
        """
        print("Sync with Google Drive.")
        response = document_stub.SyncDrive(tasks_pb2.DriveRequest(document_id=document_id, drive="gdrive"))
        for note in response:
            print(note)

        response = document_stub.SyncDrive(tasks_pb2.DriveRequest(document_id=document_id, drive="gdrive"))
        for note in response:
            print(note)
        """
        """
        print("Syncing with onedrive.")
        response = document_stub.SyncOneDrive(tasks_pb2.DriveRequest(document_id=document_id,
                                                                     item_id="F27A5B9996AB72E1%2128460"))
        for note in response:
            print(note)
        
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
                                                                         new_value="1858",
                                                                         document_id=document_id))
        for response in responses:
            print(response.id)
            print(response.attrs)

        print("Deleting note.")
        response = note_stub.DeleteNote(tasks_pb2.NoteRequest(id=note2_id,
                                                              document_id=document_id))

        print("Ensure note is deleted.")
        responses = note_stub.UpdateNoteAttr(tasks_pb2.UpdateAttrRequest(note_id=note1_id,
                                                                         attr="birth",
                                                                         new_value="1857",
                                                                         document_id=document_id))

        for response in responses:
            print(response.id)
            print(response.attrs)
        
        print("Creating archetype.")
        attrs = {"type": "blah"}
        response = note_stub.CreateArchetype(tasks_pb2.ArchetypeRequest(attrs=attrs,
                                                                        document_id=document_id,
                                                                        name="blah"))
        archetype_id = response.id
        print(archetype_id, response.name, response.attrs)

        print("Creating note from archetype.")
        response = note_stub.CreateInheritor(tasks_pb2.CreateInheritorRequest(archetype_id=archetype_id,
                                                                              document_id=document_id))
        print(response)

        print("Updating archetype.")
        response = note_stub.UpdateArchetypeAttr(tasks_pb2.UpdateArchetypeRequest(archetype_id=archetype_id,
                                                                                  document_id=document_id,
                                                                                  attr="blah",
                                                                                  val="blah"))
        for item in response:
            print(item)
        """

run()
