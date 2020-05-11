const React = require('react');
const ReactDOM = require('react-dom');
const stubs = require('../stubs.js');
import {Toolbar, Provider, themes} from '@fluentui/react-northstar';
import ReactModal from 'react-modal';
import {TextBoxComponent} from '@syncfusion/ej2-react-inputs';
import {ButtonComponent} from '@syncfusion/ej2-react-buttons';
import {
  FolderOpenOutlined,
  FormOutlined,
  SaveOutlined
} from '@ant-design/icons';

class AppToolbar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      displayNoteModal: false,

    };
  }

  handleNoteFormSubmit(event) {
    event.preventDefault();
    this.toggleDisplay('displayNoteModal');
    this.props.addNote(event.target.title.value);
  }

  toggleDisplay(key) {
    const newState = {...this.state};
    newState[key] = !newState[key];
    this.setState(newState);
  }

  render() {
    return (
      <Provider theme={themes.teams}>
        <Toolbar
          className="toolbar"
          items={[
            {
              icon: <FormOutlined />,
              onClick: () => this.toggleDisplay('displayNoteModal'),
              key: 'newNote'
            },
            {
              key: 'divider-1',
              kind: 'divider'
            },
            {
              icon: <SaveOutlined />,
              onClick: () => console.log('save'),
              key: 'save'
            },
            {
              icon: <FolderOpenOutlined />,
              onClick: () => console.log('load'),
              key: 'load'
            }
          ]}
        />
        <ReactModal
          isOpen={this.state.displayNoteModal}
          onRequestClose={() => this.toggleDisplay('displayNoteModal')}
          ariaHideApp={false}
          style={{
            content: {
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              backgroundColor: "#F5F5F5",
              height: "30%",
              width: "50%"
            }
          }}
        >
          <h3 id="new-note-modal-header">Create new note</h3>
          <form onSubmit={(event) => this.handleNoteFormSubmit(event)}>
            <TextBoxComponent placeholder="Title" name="title" />
            <ButtonComponent>Submit</ButtonComponent>
          </form>
        </ReactModal>
      </Provider>
    )
  }
}

module.exports = AppToolbar;
