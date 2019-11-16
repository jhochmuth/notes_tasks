const React = require('react');
const ReactDOM = require('react-dom');
const Note = require('./Note.js');
const NoteCreationForm = require('./NoteCreationForm.js');
const stubs = require('./stubs.js')

const appStyle = {
  height: "100%",
  width: "1000%",
}

const leftWindow = {
  height: "100%",
  width: "20%",
  position: "fixed",
  backgroundColor: "lightGray",
}

class App extends React.Component {
  constructor(props) {
    super();
    this.state = {notes: {}};
    this.addNote = this.addNote.bind(this);
    this.deleteNote = this.deleteNote.bind(this);
  }

  addNote(noteComponent) {
    let newNotes = Object.assign({}, this.state.notes);
    newNotes[noteComponent.props.id] = noteComponent;
    this.setState({notes: newNotes});
  }

  deleteNote(id) {
    let obj = this;
    let noteRequest = {id: id};

    stubs.noteStub.deleteNote(noteRequest, function(err, response) {
      if (err) {
        console.log(err);
      }

      else {
        if (response.val) {
          let newNotes = Object.assign({}, obj.state.notes);
          delete newNotes[id];
          obj.setState({notes: newNotes});
        }
      }
    })
  }

  render() {
    return (
      <div style={appStyle}>
        <div style={leftWindow}>
          <NoteCreationForm onSubmit={this.addNote} deleteNote={this.deleteNote}/>
        </div>
        <div>{Object.values(this.state.notes)}</div>
      </div>
    );
  }
}

module.exports = App;
