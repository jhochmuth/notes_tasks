const React = require('react');
const ReactDOM = require('react-dom');
const stubs = require('../stubs.js');
import {Toolbar, Provider, themes} from '@fluentui/react-northstar';
import {DialogComponent} from '@syncfusion/ej2-react-popups';
import {TextBoxComponent} from '@syncfusion/ej2-react-inputs';
import {ButtonComponent} from '@syncfusion/ej2-react-buttons';
import {
  CloudSyncOutlined,
  FileSearchOutlined,
  FolderOpenOutlined,
  FormOutlined,
  GoogleOutlined,
  ImportOutlined,
  PartitionOutlined,
  SaveOutlined
} from '@ant-design/icons';


class AppToolbar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      displayNoteModal: false,
      noteModalTitle: "",
      googleActions: false
    };

    this.noteModalButtons = [{
      buttonModel: {
        content: "Submit",
        cssClass: "e-submit"
      },
      click: () => this.handleNoteFormSubmit()
    }];
  }

  handleNoteFormSubmit() {
    this.props.addNote(this.state.noteModalTitle);
    this.state.noteModalTitle = "";
    this.toggleDisplay('displayNoteModal');
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
              icon: <ImportOutlined />,
              onClick: () => this.props.createNoteFromFile(),
              key: 'noteFromFile'
            },
            {
              key: 'divider-1',
              kind: 'divider'
            },
            {
              icon: <SaveOutlined />,
              onClick: () => this.props.save(),
              key: 'save'
            },
            {
              icon: <FolderOpenOutlined />,
              onClick: () => this.props.load(),
              key: 'load'
            },
            {
              key: 'divider-2',
              kind: 'divider'
            },
            {
              icon: <PartitionOutlined />,
              onClick: () => this.props.openTreeView(),
              key: 'treeView'
            },
            {
              key: 'divider-3',
              kind: 'divider'
            },
            {
              icon: <GoogleOutlined />,
              menuOpen: this.state.googleActions,
              onMenuOpenChange: () => this.toggleDisplay('googleActions'),
              key: 'googleActions',
              menu: [
                {
                  icon: <CloudSyncOutlined />,
                  onClick: () => this.props.syncDrive(),
                  key: 'sync',
                  content: 'Sync with drive'
                },
                {
                  icon: <FileSearchOutlined />,
                  onClick: () => this.props.toggleDriveFiles(),
                  key: 'viewDrive',
                  content: 'View drive files'
                }
              ]
            },
          ]}
        />
        <DialogComponent
          visible={this.state.displayNoteModal}
          close={(event) => event.container.children.namedItem("_dialog-content").children[0].children.title.value = ""}
          width="50%"
          height="20%"
          header="Create new note"
          showCloseIcon={true}
          allowDragging={true}
          buttons={this.noteModalButtons}
        >
          <TextBoxComponent
            placeholder="Title"
            name="title"
            width="60%"
            input={(event) => this.state.noteModalTitle = event.value}
          />
        </DialogComponent>
      </Provider>
    )
  }
}

module.exports = AppToolbar;
