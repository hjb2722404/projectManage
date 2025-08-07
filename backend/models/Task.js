class Task {
  constructor({
    id,
    name,
    type,
    projectId,
    description,
    status,
    createdAt,
    dueDate,
    plannedCompletionDate,
    actualCompletionDate,
    progress,
    updatedAt = new Date().toISOString()
  }) {
    this.id = id;
    this.name = name;
    this.type = type;
    this.projectId = projectId;
    this.description = description;
    this.status = status; // e.g., 'todo', 'in-progress', 'done'
    this.createdAt = createdAt;
    this.dueDate = dueDate;
    this.plannedCompletionDate = plannedCompletionDate;
    this.actualCompletionDate = actualCompletionDate;
    this.progress = progress; // 0-100
    this.updatedAt = updatedAt;
  }

  // Convert to plain object for JSON serialization
  toJSON() {
    return {
      id: this.id,
      name: this.name,
      type: this.type,
      projectId: this.projectId,
      description: this.description,
      status: this.status,
      createdAt: this.createdAt,
      dueDate: this.dueDate,
      plannedCompletionDate: this.plannedCompletionDate,
      actualCompletionDate: this.actualCompletionDate,
      progress: this.progress,
      updatedAt: this.updatedAt
    };
  }

  // Create a Task instance from a plain object
  static fromJSON(data) {
    return new Task(data);
  }
}

module.exports = Task;