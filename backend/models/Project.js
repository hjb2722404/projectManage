class Project {
  constructor({
    id,
    name,
    managers = [],
    upstreamContacts = [],
    downstreamContacts = [],
    startDate,
    endDate,
    createdAt = new Date().toISOString(),
    updatedAt = new Date().toISOString()
  }) {
    this.id = id;
    this.name = name;
    this.managers = managers; // [{name, phone}, ...]
    this.upstreamContacts = upstreamContacts; // [{name, phone}, ...]
    this.downstreamContacts = downstreamContacts; // [{name, phone}, ...]
    this.startDate = startDate;
    this.endDate = endDate;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  // Convert to plain object for JSON serialization
  toJSON() {
    return {
      id: this.id,
      name: this.name,
      managers: this.managers,
      upstreamContacts: this.upstreamContacts,
      downstreamContacts: this.downstreamContacts,
      startDate: this.startDate,
      endDate: this.endDate,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }

  // Create a Project instance from a plain object
  static fromJSON(data) {
    return new Project(data);
  }
}

module.exports = Project;