import type { TaskPriority } from "@/types/task";

/**
 * Checks if a task is overdue (past its due date and not marked as done).
 */
export function isTaskOverdue(
  task: { dueDate?: string; status: string },
  referenceDate: Date = new Date()
): boolean {
  if (!task.dueDate || task.status === "done") return false;

  const dueDateObj = new Date(task.dueDate);
  const refDate = new Date(referenceDate);

  dueDateObj.setHours(0, 0, 0, 0);
  refDate.setHours(0, 0, 0, 0);

  return dueDateObj.getTime() < refDate.getTime();
}

/**
 * Assigns numeric ranks to priorities for sorting: high = 3, medium = 2, low = 1.
 */
export function getPriorityRank(priority: TaskPriority): number {
  const ranks: Record<TaskPriority, number> = {
    high: 3,
    medium: 2,
    low: 1,
  };
  return ranks[priority] || 0;
}
