const React = require('react');
const SRD = require('@projectstorm/react-diagrams');
const NotePortModel = require('./NotePortModel.js')

class NotePortFactory extends SRD.AbstractPortFactory {
  constructor() {
    super();
    this.type = "note";
  }

  getNewInstance() {
    return new NotePortModel();
  }
}

module.exports = NotePortFactory;
