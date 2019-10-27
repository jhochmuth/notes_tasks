import logging

import click

from api.conditional import NumberConditional, StringConditional
from api.connection import Connection
from api.container import Container
from api.old_note import Note
from api.rule import Rule
from api.task import Task

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)


@click.group(chain=True)
@click.pass_context
def main(ctx):
    ctx.obj = dict()


@main.command()
@click.option("--id", required=True)
@click.option("--title", required=True)
@click.option("--text", required=True)
@click.argument("attr_keys", nargs=-1)
@click.argument("attr_vals", nargs=-1)
@click.pass_obj
def create_note(ctx, id, title, text, attr_keys, attr_vals):
    attrs = dict(zip(attr_keys, attr_vals))
    note = Note(id=id, title=title, text=text, attrs=attrs)
    print("Note created: {}".format(note.title))
    ctx[id] = note


@main.command()
@click.option("--note_id", required=True)
@click.option("--attr", required=True)
@click.option("--text", required=True)
@click.pass_obj
def modify_attr(ctx, note_id, attr, text):
    ctx[note_id].attrs[attr] = text


@main.command()
@click.option("--endpoint_one_id", required=True)
@click.option("--endpoint_two_id", required=True)
@click.option("--text")
@click.pass_obj
def create_connection(ctx, id, endpoint_one_id, endpoint_two_id, text):
    connection = Connection(id=id,
                            endpoint_one=ctx[endpoint_one_id],
                            endpoint_two=ctx[endpoint_two_id],
                            text=text)
    ctx[id] = connection


@main.command()
@click.option("--id", required=True)
@click.argument("note_ids", nargs=-1)
@click.pass_obj
def create_container(ctx, id, note_ids):
    notes = [ctx[id] for id in note_ids]
    container = Container(id=id, notes=notes)
    ctx[id] = container


@main.command()
@click.option("--container_id", required=True)
@click.option("--note_id", required=True)
@click.pass_obj
def add_note_to_container(ctx, container_id, note_id):
    ctx[container_id].add_note(ctx[note_id])


@main.command()
@click.option("--id", required=True)
@click.option("--target", required=True)
@click.option("--condition", required=True)
@click.option("--type", required=True)
@click.pass_obj
def create_conditional(ctx, id, target, condition, type):
    if type == "number":
        ctx[id] = NumberConditional(id=id, target=target, condition=condition)
    else:
        ctx[id] = StringConditional(id=id, target=target, condition=condition)


@main.command()
@click.option("--container_id", required=True)
@click.option("--condition_id", required=True)
@click.argument("attrs", nargs=-1)
@click.pass_obj
def search_container(ctx, container_id, condition_id, attrs):
    results = ctx[container_id].search_child_note_attrs(ctx[condition_id], attrs)
    logger.log(results)


@main.command()
@click.option("--id", required=True)
@click.option("--target", required=True)
@click.option("--add_text", required=True)
@click.option("--effect_location")
@click.pass_obj
def create_rule(ctx, id, target, add_text, effect_location):
    ctx[id] = Rule(id=id, target=target, add_text=add_text, effect_location=effect_location)


@main.command()
@click.pass_obj
def add_rule(ctx, container_id, rule_id):
    ctx[container_id].add_rule(ctx[rule_id])


@main.command()
@click.pass_obj
def save_document(ctx, document_id):
    pass


if __name__ == "__main__":
    main()
