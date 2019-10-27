from concurrent import futures
import time

import grpc

from api.note import Note
from api.uid import UID
import tasks_pb2
import tasks_pb2_grpc


# TODO: Learn context or replace with global document so references to other objects can be made.
class NoteServicer(tasks_pb2_grpc.NoteManagerServicer):
    def CreateNote(self, request, context):
        note = Note(id=UID().assign_uid(),
                    title=request.attrs["title"],
                    text=request.attrs["text"],
                    attrs=request.attrs,
                    parent_container=None)

        return tasks_pb2.NoteReply(id=note.id,
                                   attrs=note.attrs,
                                   parent_container=-1)


def serve():
  server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))
  tasks_pb2_grpc.add_NoteManagerServicer_to_server(NoteServicer(), server)
  server.add_insecure_port('[::]:50051')
  server.start()
  try:
    while True:
      time.sleep(100000)
  except KeyboardInterrupt:
    server.stop(0)


serve()
