const React = require('react');
const Note = require('./Note.js');
const stubs = require('./stubs.js')

class NoteCreationForm extends React.Component {
  constructor() {
    super();
    this.state = {title: "Title", text: "Text"};
    this.onSubmit = this.onSubmit.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  onChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({[name]: value});
  }

  onSubmit(event) {
    let obj = this;
    event.preventDefault();
    let attrs = {title: this.state.title, text: this.state.text};
    let noteRequest = {attrs: attrs};
    stubs.noteStub.createNote(noteRequest, function(err, noteResponse) {
      if (err) {
        console.log(err);
      }
      else {
        let note = <Note key={noteResponse.id} noteData={noteResponse} />;
        obj.props.onSubmit(note);
      }
    });
  }

  render() {
    return (
      <form onSubmit={this.onSubmit}>
        <input type="text" name="title" onChange={this.onChange} value={this.state.title} />
        <input type="text" name="text" onChange={this.onChange} value={this.state.text} />
        <input type="submit" value="Submit" />
      </form>
    );
  }
}

module.exports = NoteCreationForm;
