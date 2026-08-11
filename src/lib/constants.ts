import type { TaskPriority, TaskStatus } from "@/types/task";

export const STATUS_OPTIONS: { value: TaskStatus; label: string }[] = [
  { value: "todo", label: "To Do" },
  { value: "in-progress", label: "In Progress" },
  { value: "done", label: "Done" },
];

export const PRIORITY_OPTIONS: { value: TaskPriority; label: string }[] = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
];

export const STATUS_BADGE_CLASSES: Record<TaskStatus, string> = {
  todo: "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300",
  "in-progress":
    "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300",
  done: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300",
};

export const PRIORITY_BADGE_CLASSES: Record<TaskPriority, string> = {
  low: "bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300",
  medium:
    "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300",
  high: "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300",
};
