export class TaskError extends Error {
  constructor(
    public readonly code: string,
    message: string,
  ) {
    super(message);
    this.name = "TaskError";
  }
}

export class NotAuthorizedTaskModifierError extends TaskError {
  constructor() {
    super(
      "TASK_NOT_AUTHORIZED_MODIFIER",
      "Not authorized to modify this task. Must be the assignee or a project admin.",
    );
  }
}

export class NotAuthorizedTaskDeleterError extends TaskError {
  constructor() {
    super(
      "TASK_NOT_AUTHORIZED_DELETER",
      "Not authorized to delete this task. Must be a project admin.",
    );
  }
}
