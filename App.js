const React = require('react');
const ReactDOM = require('react-dom');
const Note = require('./Note.js');
const NoteCreationForm = require('./NoteCreationForm.js');

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
    this.state = {notes: []}
    this.addNote = this.addNote.bind(this);
  }

  addNote(noteComponent) {
    let newNotes = this.state.notes.concat([noteComponent]);
    this.setState({notes: newNotes});
  }

  render() {
    return (
      <div style={appStyle}>
        <div style={leftWindow}>
          <NoteCreationForm onSubmit={this.addNote} />
        </div>
        <div>
          {this.state.notes}
        </div>
      </div>
    );
  }
}

module.exports = App;
