const React = require('react');
const ReactDOM = require('react-dom');
const Note = require('./Note.js');
const NoteCreationForm = require('./NoteCreationForm.js')

const appStyle = {
  height: "100%",
  width: "1000%"
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
        <NoteCreationForm onSubmit={this.addNote}/>
        {this.state.notes}
      </div>
    );
  }
}

module.exports = App;
