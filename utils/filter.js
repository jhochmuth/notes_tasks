class Filter {
  constructor(attr, value, operation) {
    this.attr = attr;
    this.value = value;
    this.operation = operation;
  }

  doesFilter(noteAttrs) {
    let containsOp;
    if (this.operation === "contains") containsOp = true;
    else containsOp = false;

    if (this.attr == "all") {
      for (attr in noteAttrs) {
        if (noteAttrs[attr].includes(this.value)) return containsOp;
      }
    }
    else if (this.attr && this.attr in noteAttrs) {
      if (noteAttrs[this.attr].includes(this.value)) return containsOp;
    }

    return !containsOp;
  }
}

module.exports = Filter;
