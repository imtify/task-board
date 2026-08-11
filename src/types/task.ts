export type TaskStatus = "todo" | "in-progress" | "done";

export type TaskPriority = "low" | "medium" | "high";

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: string; // ISO date string, e.g. "2026-08-20"
  createdAt: string;
  updatedAt: string;
}

// Shape sent from the create/edit form before the server assigns
// id / createdAt / updatedAt.
export type TaskInput = {
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: string;
};
