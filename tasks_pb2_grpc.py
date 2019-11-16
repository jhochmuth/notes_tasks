# Generated by the gRPC Python protocol compiler plugin. DO NOT EDIT!
import grpc

import tasks_pb2 as tasks__pb2


class NoteManagerStub(object):
  # missing associated documentation comment in .proto file
  pass

  def __init__(self, channel):
    """Constructor.

    Args:
      channel: A grpc.Channel.
    """
    self.CreateNote = channel.unary_unary(
        '/NoteManager/CreateNote',
        request_serializer=tasks__pb2.NoteRequest.SerializeToString,
        response_deserializer=tasks__pb2.NoteReply.FromString,
        )
    self.UpdateNoteAttr = channel.unary_unary(
        '/NoteManager/UpdateNoteAttr',
        request_serializer=tasks__pb2.UpdateAttrRequest.SerializeToString,
        response_deserializer=tasks__pb2.NoteReply.FromString,
        )
    self.DeleteNoteAttr = channel.unary_unary(
        '/NoteManager/DeleteNoteAttr',
        request_serializer=tasks__pb2.DeleteAttrRequest.SerializeToString,
        response_deserializer=tasks__pb2.BoolWrapper.FromString,
        )
    self.DeleteNote = channel.unary_unary(
        '/NoteManager/DeleteNote',
        request_serializer=tasks__pb2.NoteRequest.SerializeToString,
        response_deserializer=tasks__pb2.BoolWrapper.FromString,
        )


class NoteManagerServicer(object):
  # missing associated documentation comment in .proto file
  pass

  def CreateNote(self, request, context):
    # missing associated documentation comment in .proto file
    pass
    context.set_code(grpc.StatusCode.UNIMPLEMENTED)
    context.set_details('Method not implemented!')
    raise NotImplementedError('Method not implemented!')

  def UpdateNoteAttr(self, request, context):
    # missing associated documentation comment in .proto file
    pass
    context.set_code(grpc.StatusCode.UNIMPLEMENTED)
    context.set_details('Method not implemented!')
    raise NotImplementedError('Method not implemented!')

  def DeleteNoteAttr(self, request, context):
    # missing associated documentation comment in .proto file
    pass
    context.set_code(grpc.StatusCode.UNIMPLEMENTED)
    context.set_details('Method not implemented!')
    raise NotImplementedError('Method not implemented!')

  def DeleteNote(self, request, context):
    # missing associated documentation comment in .proto file
    pass
    context.set_code(grpc.StatusCode.UNIMPLEMENTED)
    context.set_details('Method not implemented!')
    raise NotImplementedError('Method not implemented!')


def add_NoteManagerServicer_to_server(servicer, server):
  rpc_method_handlers = {
      'CreateNote': grpc.unary_unary_rpc_method_handler(
          servicer.CreateNote,
          request_deserializer=tasks__pb2.NoteRequest.FromString,
          response_serializer=tasks__pb2.NoteReply.SerializeToString,
      ),
      'UpdateNoteAttr': grpc.unary_unary_rpc_method_handler(
          servicer.UpdateNoteAttr,
          request_deserializer=tasks__pb2.UpdateAttrRequest.FromString,
          response_serializer=tasks__pb2.NoteReply.SerializeToString,
      ),
      'DeleteNoteAttr': grpc.unary_unary_rpc_method_handler(
          servicer.DeleteNoteAttr,
          request_deserializer=tasks__pb2.DeleteAttrRequest.FromString,
          response_serializer=tasks__pb2.BoolWrapper.SerializeToString,
      ),
      'DeleteNote': grpc.unary_unary_rpc_method_handler(
          servicer.DeleteNote,
          request_deserializer=tasks__pb2.NoteRequest.FromString,
          response_serializer=tasks__pb2.BoolWrapper.SerializeToString,
      ),
  }
  generic_handler = grpc.method_handlers_generic_handler(
      'NoteManager', rpc_method_handlers)
  server.add_generic_rpc_handlers((generic_handler,))


class ConnectionManagerStub(object):
  # missing associated documentation comment in .proto file
  pass

  def __init__(self, channel):
    """Constructor.

    Args:
      channel: A grpc.Channel.
    """
    self.CreateConnection = channel.unary_unary(
        '/ConnectionManager/CreateConnection',
        request_serializer=tasks__pb2.ConnectionRequest.SerializeToString,
        response_deserializer=tasks__pb2.ConnectionReply.FromString,
        )


class ConnectionManagerServicer(object):
  # missing associated documentation comment in .proto file
  pass

  def CreateConnection(self, request, context):
    # missing associated documentation comment in .proto file
    pass
    context.set_code(grpc.StatusCode.UNIMPLEMENTED)
    context.set_details('Method not implemented!')
    raise NotImplementedError('Method not implemented!')


def add_ConnectionManagerServicer_to_server(servicer, server):
  rpc_method_handlers = {
      'CreateConnection': grpc.unary_unary_rpc_method_handler(
          servicer.CreateConnection,
          request_deserializer=tasks__pb2.ConnectionRequest.FromString,
          response_serializer=tasks__pb2.ConnectionReply.SerializeToString,
      ),
  }
  generic_handler = grpc.method_handlers_generic_handler(
      'ConnectionManager', rpc_method_handlers)
  server.add_generic_rpc_handlers((generic_handler,))


class ContainerManagerStub(object):
  # missing associated documentation comment in .proto file
  pass

  def __init__(self, channel):
    """Constructor.

    Args:
      channel: A grpc.Channel.
    """
    self.CreateContainer = channel.unary_unary(
        '/ContainerManager/CreateContainer',
        request_serializer=tasks__pb2.ContainerRequest.SerializeToString,
        response_deserializer=tasks__pb2.ContainerReply.FromString,
        )
    self.AddNote = channel.unary_unary(
        '/ContainerManager/AddNote',
        request_serializer=tasks__pb2.AddNoteRequest.SerializeToString,
        response_deserializer=tasks__pb2.ContainerReply.FromString,
        )
    self.RemoveNote = channel.unary_unary(
        '/ContainerManager/RemoveNote',
        request_serializer=tasks__pb2.AddNoteRequest.SerializeToString,
        response_deserializer=tasks__pb2.ContainerReply.FromString,
        )
    self.SearchChildNoteAttrs = channel.unary_unary(
        '/ContainerManager/SearchChildNoteAttrs',
        request_serializer=tasks__pb2.ContainerSearchRequest.SerializeToString,
        response_deserializer=tasks__pb2.ContainerSearchReply.FromString,
        )
    self.DeleteContainer = channel.unary_unary(
        '/ContainerManager/DeleteContainer',
        request_serializer=tasks__pb2.ContainerRequest.SerializeToString,
        response_deserializer=tasks__pb2.BoolWrapper.FromString,
        )


class ContainerManagerServicer(object):
  # missing associated documentation comment in .proto file
  pass

  def CreateContainer(self, request, context):
    # missing associated documentation comment in .proto file
    pass
    context.set_code(grpc.StatusCode.UNIMPLEMENTED)
    context.set_details('Method not implemented!')
    raise NotImplementedError('Method not implemented!')

  def AddNote(self, request, context):
    # missing associated documentation comment in .proto file
    pass
    context.set_code(grpc.StatusCode.UNIMPLEMENTED)
    context.set_details('Method not implemented!')
    raise NotImplementedError('Method not implemented!')

  def RemoveNote(self, request, context):
    # missing associated documentation comment in .proto file
    pass
    context.set_code(grpc.StatusCode.UNIMPLEMENTED)
    context.set_details('Method not implemented!')
    raise NotImplementedError('Method not implemented!')

  def SearchChildNoteAttrs(self, request, context):
    # missing associated documentation comment in .proto file
    pass
    context.set_code(grpc.StatusCode.UNIMPLEMENTED)
    context.set_details('Method not implemented!')
    raise NotImplementedError('Method not implemented!')

  def DeleteContainer(self, request, context):
    # missing associated documentation comment in .proto file
    pass
    context.set_code(grpc.StatusCode.UNIMPLEMENTED)
    context.set_details('Method not implemented!')
    raise NotImplementedError('Method not implemented!')


def add_ContainerManagerServicer_to_server(servicer, server):
  rpc_method_handlers = {
      'CreateContainer': grpc.unary_unary_rpc_method_handler(
          servicer.CreateContainer,
          request_deserializer=tasks__pb2.ContainerRequest.FromString,
          response_serializer=tasks__pb2.ContainerReply.SerializeToString,
      ),
      'AddNote': grpc.unary_unary_rpc_method_handler(
          servicer.AddNote,
          request_deserializer=tasks__pb2.AddNoteRequest.FromString,
          response_serializer=tasks__pb2.ContainerReply.SerializeToString,
      ),
      'RemoveNote': grpc.unary_unary_rpc_method_handler(
          servicer.RemoveNote,
          request_deserializer=tasks__pb2.AddNoteRequest.FromString,
          response_serializer=tasks__pb2.ContainerReply.SerializeToString,
      ),
      'SearchChildNoteAttrs': grpc.unary_unary_rpc_method_handler(
          servicer.SearchChildNoteAttrs,
          request_deserializer=tasks__pb2.ContainerSearchRequest.FromString,
          response_serializer=tasks__pb2.ContainerSearchReply.SerializeToString,
      ),
      'DeleteContainer': grpc.unary_unary_rpc_method_handler(
          servicer.DeleteContainer,
          request_deserializer=tasks__pb2.ContainerRequest.FromString,
          response_serializer=tasks__pb2.BoolWrapper.SerializeToString,
      ),
  }
  generic_handler = grpc.method_handlers_generic_handler(
      'ContainerManager', rpc_method_handlers)
  server.add_generic_rpc_handlers((generic_handler,))


class ConditionalManagerStub(object):
  # missing associated documentation comment in .proto file
  pass

  def __init__(self, channel):
    """Constructor.

    Args:
      channel: A grpc.Channel.
    """
    self.CreateConditional = channel.unary_unary(
        '/ConditionalManager/CreateConditional',
        request_serializer=tasks__pb2.ConditionalRequest.SerializeToString,
        response_deserializer=tasks__pb2.ConditionalReply.FromString,
        )


class ConditionalManagerServicer(object):
  # missing associated documentation comment in .proto file
  pass

  def CreateConditional(self, request, context):
    # missing associated documentation comment in .proto file
    pass
    context.set_code(grpc.StatusCode.UNIMPLEMENTED)
    context.set_details('Method not implemented!')
    raise NotImplementedError('Method not implemented!')


def add_ConditionalManagerServicer_to_server(servicer, server):
  rpc_method_handlers = {
      'CreateConditional': grpc.unary_unary_rpc_method_handler(
          servicer.CreateConditional,
          request_deserializer=tasks__pb2.ConditionalRequest.FromString,
          response_serializer=tasks__pb2.ConditionalReply.SerializeToString,
      ),
  }
  generic_handler = grpc.method_handlers_generic_handler(
      'ConditionalManager', rpc_method_handlers)
  server.add_generic_rpc_handlers((generic_handler,))


class RuleManagerStub(object):
  # missing associated documentation comment in .proto file
  pass

  def __init__(self, channel):
    """Constructor.

    Args:
      channel: A grpc.Channel.
    """
    self.CreateRule = channel.unary_unary(
        '/RuleManager/CreateRule',
        request_serializer=tasks__pb2.RuleRequest.SerializeToString,
        response_deserializer=tasks__pb2.RuleReply.FromString,
        )


class RuleManagerServicer(object):
  # missing associated documentation comment in .proto file
  pass

  def CreateRule(self, request, context):
    # missing associated documentation comment in .proto file
    pass
    context.set_code(grpc.StatusCode.UNIMPLEMENTED)
    context.set_details('Method not implemented!')
    raise NotImplementedError('Method not implemented!')


def add_RuleManagerServicer_to_server(servicer, server):
  rpc_method_handlers = {
      'CreateRule': grpc.unary_unary_rpc_method_handler(
          servicer.CreateRule,
          request_deserializer=tasks__pb2.RuleRequest.FromString,
          response_serializer=tasks__pb2.RuleReply.SerializeToString,
      ),
  }
  generic_handler = grpc.method_handlers_generic_handler(
      'RuleManager', rpc_method_handlers)
  server.add_generic_rpc_handlers((generic_handler,))