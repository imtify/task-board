import React from "react";
import type { Task } from "@/types/task";
import { Badge } from "@/components/ui/Badge";
import {
  STATUS_BADGE_CLASSES,
  PRIORITY_BADGE_CLASSES,
  STATUS_OPTIONS,
  PRIORITY_OPTIONS,
} from "@/lib/constants";
import { Calendar, Edit, Trash2 } from "lucide-react";
import { isTaskOverdue } from "@/lib/taskUtils";

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

export function TaskCard({ task, onEdit, onDelete }: TaskCardProps) {
  const statusLabel = STATUS_OPTIONS.find((o) => o.value === task.status)?.label || task.status;
  const priorityLabel = PRIORITY_OPTIONS.find((o) => o.value === task.priority)?.label || task.priority;

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return null;
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formattedDate = formatDate(task.dueDate);

  const isOverdue = isTaskOverdue(task);

  return (
    <div className="group relative flex flex-col justify-between rounded-xl border border-zinc-200 bg-white p-5 shadow-xs transition-all duration-200 hover:border-zinc-300 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900/50 dark:hover:border-zinc-700">
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <Badge className={STATUS_BADGE_CLASSES[task.status]}>
            {statusLabel}
          </Badge>
          <Badge className={PRIORITY_BADGE_CLASSES[task.priority]}>
            {priorityLabel}
          </Badge>
        </div>

        <div className="flex flex-col gap-1.5">
          <h3 className="font-semibold text-zinc-900 line-clamp-1 dark:text-zinc-50 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors duration-150">
            {task.title}
          </h3>
          {task.description && (
            <p className="text-sm text-zinc-500 line-clamp-2 dark:text-zinc-400">
              {task.description}
            </p>
          )}
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between border-t border-zinc-100 pt-3 dark:border-zinc-800/80">
        <div className="flex items-center gap-1.5 text-xs">
          {formattedDate ? (
            <span
              className={`flex items-center gap-1.5 font-medium ${
                isOverdue
                  ? "text-rose-600 dark:text-rose-400"
                  : "text-zinc-500 dark:text-zinc-400"
              }`}
            >
              <Calendar className="h-3.5 w-3.5" />
              {formattedDate}
              {isOverdue && <span className="font-bold">(Overdue)</span>}
            </span>
          ) : (
            <span className="text-zinc-400 dark:text-zinc-600">No due date</span>
          )}
        </div>

        <div className="flex items-center gap-1 opacity-85 group-hover:opacity-100 transition-opacity duration-150">
          <button
            onClick={() => onEdit(task)}
            className="rounded-lg p-1.5 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-200 transition-colors"
            title="Edit Task"
          >
            <Edit className="h-4 w-4" />
          </button>
          <button
            onClick={() => onDelete(task.id)}
            className="rounded-lg p-1.5 text-zinc-500 hover:bg-rose-50 hover:text-rose-600 dark:text-zinc-400 dark:hover:bg-rose-950/30 dark:hover:text-rose-400 transition-colors"
            title="Delete Task"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
