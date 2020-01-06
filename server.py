from concurrent import futures
import time
import grpc

from api.conditional import Conditional
from api.connection import Connection
from api.container import Container
from api.document import Document
from api.note import Note
import tasks_pb2
import tasks_pb2_grpc


documents = dict()


class DocumentServicer(tasks_pb2_grpc.DocumentManagerServicer):
    def CreateDocument(self, request, context):
        document = Document()
        documents[document.id] = document
        return tasks_pb2.CreateDocumentReply(id=document.id)

    def CloseDocument(self, request, context):
        del documents[request.id]
        return tasks_pb2.BoolWrapper(val=True)

    def SaveDocument(self, request, context):
        documents[request.document_id].save_document(request.filename)
        return tasks_pb2.BoolWrapper(val=True)

    def LoadDocument(self, request, context):
        document = Document.load_document(request.file)
        documents[document.id] = document
        return tasks_pb2.CreateDocumentReply(id=document.id)


class NoteServicer(tasks_pb2_grpc.NoteManagerServicer):
    def CreateNote(self, request, context):
        note = Note(title=request.attrs["title"],
                    text=request.attrs["text"],
                    id=request.id,
                    attrs=dict(request.attrs),
                    parent_container=documents[request.document_id].children[request.parent_container_id]
                    if len(request.parent_container_id) > 0
                    else None)

        documents[request.document_id].children[note.id] = note

        return tasks_pb2.NoteReply(id=note.id,
                                   attrs=note.attrs,
                                   parent_container_id=request.parent_container_id)

    """Returns: NoteReply with attrs dict that contains only the updated attr."""
    def UpdateNoteAttr(self, request, context):
        note = documents[request.document_id].children[request.note_id]

        note.update_attr(request.attr, request.new_value)

        return tasks_pb2.NoteReply(id=request.note_id,
                                   attrs=note.attrs)

    def DeleteNoteAttr(self, request, context):
        note = documents[request.document_id].children[request.note_id]

        note.delete_attr(request.attr)

        return tasks_pb2.BoolWrapper(val=True)

    def DeleteNote(self, request, context):
        note = documents[request.document_id].children[request.id]
        note.delete()
        del documents[request.document_id].children[request.id]
        return tasks_pb2.BoolWrapper(val=True)


class ConnectionServicer(tasks_pb2_grpc.ConnectionManagerServicer):
    def CreateConnection(self, request, context):
        connection = Connection(endpoint_one=documents[request.document_id].children[request.endpoint_one_id] if request.endpoint_one_id else None,
                                endpoint_two=documents[request.document_id].children[request.endpoint_two_id] if request.endpoint_two_id else None,
                                text=request.text,
                                id=request.id)

        documents[request.document_id].children[connection.id] = connection

        return tasks_pb2.ConnectionReply(id=connection.id,
                                         endpoint_one_id=request.endpoint_one_id,
                                         endpoint_two_id=request.endpoint_two_id,
                                         text=request.text)

    def AddEndpoint(self, request, context):
        connection = documents[request.document_id].children[request.id]
        connection.change_second_endpoint(documents[request.document_id].children[request.endpoint_two_id])

        return tasks_pb2.ConnectionReply(id=connection.id,
                                         endpoint_two_id=request.endpoint_two_id)

    def AddLabel(self, request, context):
        connection = documents[request.document_id].children[request.id]
        connection.change_label(request.text)
        return tasks_pb2.ConnectionReply(id=connection.id)

    def DeleteConnection(self, request, context):
        del documents[request.document_id].children[request.id]
        return tasks_pb2.BoolWrapper(val=True)


class ContainerServicer(tasks_pb2_grpc.ContainerManagerServicer):
    def CreateContainer(self, request, context):
        notes = [documents[request.document_id].children[note_id] for note_id in request.child_note_ids]

        container = Container(attrs=request.attrs,
                              notes=notes)

        document.children[container.id] = container

        return tasks_pb2.ContainerReply(id=container.id,
                                        attrs=container.attrs,
                                        child_note_ids=request.child_note_ids)

    def AddNote(self, request, context):
        container = document.children[request.container_id]
        note = document.children[request.note_id]
        container.add_note(note)
        child_note_ids = [note.id for note in container.notes]

        return tasks_pb2.ContainerReply(id=container.id,
                                        child_note_ids=child_note_ids)

    def RemoveNote(self, request, context):
        container = document.children[request.container_id]
        note = document.children[request.note_id]
        container.remove_note(note)
        child_note_ids = [note.id for note in container.notes]

        return tasks_pb2.ContainerReply(id=container.id,
                                        child_note_ids=child_note_ids)

    def SearchChildNoteAttrs(self, request, context):
        container = document.children[request.container_id]
        condition = document.children[request.conditional_id]
        attrs = request.attrs

        result = container.search_child_note_attrs(condition=condition,
                                                   attrs=attrs)

        result = [note.id for note in result]
        return tasks_pb2.ContainerSearchReply(result=result)

    def DeleteContainer(self, request, context):
        container = document.children


class ConditionalServicer(tasks_pb2_grpc.ConditionalManagerServicer):
    def CreateConditional(self, request, context):
        condition = Conditional(target=request.target, condition=request.condition)

        document.children[condition.id] = condition

        return tasks_pb2.ConditionalReply(id=condition.id,
                                          target=request.target,
                                          condition=request.condition)


def serve():
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))
    tasks_pb2_grpc.add_DocumentManagerServicer_to_server(DocumentServicer(), server)
    tasks_pb2_grpc.add_NoteManagerServicer_to_server(NoteServicer(), server)
    tasks_pb2_grpc.add_ConnectionManagerServicer_to_server(ConnectionServicer(), server)
    tasks_pb2_grpc.add_ContainerManagerServicer_to_server(ContainerServicer(), server)
    tasks_pb2_grpc.add_ConditionalManagerServicer_to_server(ConditionalServicer(), server)
    server.add_insecure_port('[::]:50051')
    server.start()
    try:
        while True:
            time.sleep(100000)
    except KeyboardInterrupt:
        server.stop(0)


serve()
