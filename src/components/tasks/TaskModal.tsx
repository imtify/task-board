import React, { useState, useEffect } from "react";
import { Modal } from "@/components/ui/Modal";
import type { Task, TaskInput, TaskStatus, TaskPriority } from "@/types/task";
import { STATUS_OPTIONS, PRIORITY_OPTIONS } from "@/lib/constants";
import { Loader2 } from "lucide-react";

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task | null;
  onSave: (taskInput: TaskInput) => Promise<boolean>;
}

export function TaskModal({ isOpen, onClose, task, onSave }: TaskModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<TaskStatus>("todo");
  const [priority, setPriority] = useState<TaskPriority>("medium");
  const [dueDate, setDueDate] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isOpen) {
      if (task) {
        setTitle(task.title);
        setDescription(task.description || "");
        setStatus(task.status);
        setPriority(task.priority);
        setDueDate(task.dueDate || "");
      } else {
        setTitle("");
        setDescription("");
        setStatus("todo");
        setPriority("medium");
        setDueDate("");
      }
      setErrors({});
      setSubmitting(false);
    }
  }, [isOpen, task]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const formErrors: Record<string, string> = {};
    if (!title.trim()) {
      formErrors.title = "Title is required";
    } else if (title.trim().length < 3) {
      formErrors.title = "Title must be at least 3 characters long";
    }

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    setSubmitting(true);
    const success = await onSave({
      title: title.trim(),
      description: description.trim() || undefined,
      status,
      priority,
      dueDate: dueDate || undefined,
    });

    setSubmitting(false);
    if (success) {
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={task ? "Edit Task" : "Create New Task"}
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="title"
            className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400"
          >
            Title <span className="text-rose-500">*</span>
          </label>
          <input
            id="title"
            type="text"
            placeholder="e.g. Design Landing Page"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={submitting}
            className={`w-full rounded-lg border bg-white px-3.5 py-2 text-sm outline-hidden focus:ring-1 dark:bg-zinc-950 transition-colors ${
              errors.title
                ? "border-rose-300 focus:border-rose-500 focus:ring-rose-500 dark:border-rose-900/40"
                : "border-zinc-200 focus:border-amber-500 focus:ring-amber-500 dark:border-zinc-800"
            }`}
          />
          {errors.title && (
            <p className="text-xs text-rose-600 dark:text-rose-400">{errors.title}</p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="description"
            className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400"
          >
            Description
          </label>
          <textarea
            id="description"
            rows={3}
            placeholder="Add some details about this task..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={submitting}
            className="w-full rounded-lg border border-zinc-200 bg-white px-3.5 py-2 text-sm outline-hidden focus:border-amber-500 focus:ring-1 focus:ring-amber-500 dark:border-zinc-800 dark:bg-zinc-950 transition-colors resize-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="status"
              className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400"
            >
              Status
            </label>
            <select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value as TaskStatus)}
              disabled={submitting}
              className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm outline-hidden focus:border-amber-500 focus:ring-1 focus:ring-amber-500 dark:border-zinc-800 dark:bg-zinc-950 text-zinc-700 dark:text-zinc-300 transition-colors"
            >
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="priority"
              className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400"
            >
              Priority
            </label>
            <select
              id="priority"
              value={priority}
              onChange={(e) => setPriority(e.target.value as TaskPriority)}
              disabled={submitting}
              className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm outline-hidden focus:border-amber-500 focus:ring-1 focus:ring-amber-500 dark:border-zinc-800 dark:bg-zinc-950 text-zinc-700 dark:text-zinc-300 transition-colors"
            >
              {PRIORITY_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="dueDate"
            className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400"
          >
            Due Date
          </label>
          <input
            id="dueDate"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            disabled={submitting}
            className="w-full rounded-lg border border-zinc-200 bg-white px-3.5 py-2 text-sm outline-hidden focus:border-amber-500 focus:ring-1 focus:ring-amber-500 dark:border-zinc-800 dark:bg-zinc-950 text-zinc-700 dark:text-zinc-300 transition-colors"
          />
        </div>

        <div className="mt-4 flex items-center justify-end gap-3 border-t border-zinc-100 pt-4 dark:border-zinc-800">
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm font-semibold text-zinc-700 hover:bg-zinc-50 disabled:opacity-50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300 dark:hover:bg-zinc-900 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center gap-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 px-4 py-2 text-sm font-semibold text-white shadow-sm disabled:opacity-50 transition-colors cursor-pointer"
          >
            {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
            {task ? "Save Changes" : "Create Task"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
