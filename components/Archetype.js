const React = require('react');
import {Menu} from 'antd';
import {Button, Form, FormGroup, Input, InputGroup, Label} from 'reactstrap';
import Drawer from 'rc-drawer';
const stubs = require('../stubs.js');
import {TextBoxComponent} from '@syncfusion/ej2-react-inputs';
import {ButtonComponent} from '@syncfusion/ej2-react-buttons';


class Archetype extends React.Component {
  constructor(props) {
    super(props)
    this.id = props.id,

    this.state = {
      name: props.name,
      attrs: props.attrs,
      displayDrawer: false,
      displayEditArchetypeName: false
    };
  }

  updateName(newName) {
    const newState = {...this.state};
    newState.name = newName;
    this.setState(newState);
  }

  toggleDrawer() {
    const newState = Object.assign({}, this.state);
    newState.displayDrawer = !newState.displayDrawer;
    this.setState(newState);
  }

  handleDoubleClick() {
    if (!this.state.displayDrawer) this.toggleDrawer();
  }

  toggleEditNameDrawer() {
    const newState = Object.assign({}, this.state);
    newState.displayEditArchetypeName = !newState.displayEditArchetypeName;
    this.setState(newState);
  }

  renderArchetypeAttrs() {
    const that = this;

    if (!this.state.attrs || !Object.keys(this.state.attrs).length) {
      return <span>No attributes</span>
    }

    return Object.keys(this.state.attrs).map(function(attr) {
      return (
        <div
          key={attr}
          className="attr"
        >
          <span className="attr-text">
            <b>{attr}:</b> {that.state.attrs[attr]}
          </span>
          <Button close
            className="delete-attr-button"
            onClick={() => that.deleteArchetypeAttr(attr)}
          />
        </div>
      )
    });
  }

  addAttribute(event) {
    event.preventDefault();

    const that = this;

    if (event.target.attr.value == "" || event.target.val.value == "") {
      alert("Must enter values for attribute and value.");
      return;
    }

    const request = {
      archetype_id: this.id,
      attr: event.target.attr.value,
      val: event.target.val.value,
      document_id: this.props.documentId
    }

    event.target.attr.value = "";
    event.target.val.value = "";

    const newState = Object.assign({}, this.state);
    newState.attrs[request.attr] = request.val;
    this.setState(newState);

    this.props.updateInheritors(request);
  }

  editName(event) {
    event.preventDefault();
    const that = this;

    const request = {
      id: this.id,
      name: event.target.name.value,
      document_id: this.props.documentId
    }

    stubs.noteStub.editArchetypeName(request, function(err, response) {
      if (err) console.log(err);
      else {
        const newState = Object.assign({}, that.state);
        newState.name = response.name;
        that.setState(newState, () => that.toggleEditNameDrawer());
      }
    })
  }

  render() {
    return (
      <div
        draggable={true}
        onDragStart={(event) => {
          this.props.toggle();
          event.dataTransfer.setData("create-from-archetype", JSON.stringify(this.id));
        }}
        onDoubleClick={() => this.handleDoubleClick()}
      >
        <span>{this.state.name}</span>
        <Drawer
          width="30%"
          handler={false}
          open={this.state.displayDrawer}
          onClose={() => this.toggleDrawer()}
          placement="left"
        >
          <h3
            id="archetype-name"
            onDoubleClick={() => this.toggleEditNameDrawer()}
          >{this.state.name}</h3>
          <div className="archetype-display archetype-display-header">
            <h4>Attributes</h4>
            {this.renderArchetypeAttrs()}
          </div>
          <form onSubmit={(event) => this.addAttribute(event)}>
            <TextBoxComponent
              placeholder="Attribute"
              name="attr"
              width="80%"
              cssClass="x-centered"
            />
            <TextBoxComponent
              placeholder="Value"
              name="val"
              width="80%"
              cssClass="x-centered"
            />
            <ButtonComponent content="Add attribute" cssClass="form-submit-button e-success" />
          </form>
          <Drawer
            width="30%"
            handler={false}
            open={this.state.displayEditArchetypeName}
            onClose={() => this.toggleEditNameDrawer()}
            placement="left"
          >
            <form onSubmit={(event) => this.editName(event)}>
              <h4 className="text-centered margin">Change name</h4>
              <TextBoxComponent
                placeholder="Name"
                name="name"
                width="80%"
                cssClass="x-centered"
              />
              <ButtonComponent content="Submit" cssClass="form-submit-button e-success" />
            </form>
          </Drawer>
        </Drawer>
      </div>
    )
  }
}

module.exports = Archetype;
