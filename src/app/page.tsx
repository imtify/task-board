"use client";

import { useState, useEffect } from "react";
import type { Task, TaskStatus, TaskPriority, TaskInput } from "@/types/task";
import { FilterBar } from "@/components/tasks/FilterBar";
import { TaskCard } from "@/components/tasks/TaskCard";
import { TaskModal } from "@/components/tasks/TaskModal";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { ClipboardList, AlertCircle, Loader2 } from "lucide-react";
import { getPriorityRank } from "@/lib/taskUtils";

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<TaskStatus | "all">("all");
  const [sortBy, setSortBy] = useState<"createdAt" | "dueDate" | "priority">("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("/api/tasks");
      if (!res.ok) {
        throw new Error("Failed to load tasks");
      }
      const data = await res.json();
      setTasks(data);
    } catch (err: any) {
      setError(err.message || "An error occurred while loading tasks.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = task.title.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || task.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    let comparison = 0;

    if (sortBy === "createdAt") {
      comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    } else if (sortBy === "dueDate") {
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      comparison = new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    } else if (sortBy === "priority") {
      comparison = getPriorityRank(a.priority) - getPriorityRank(b.priority);
    }

    return sortOrder === "asc" ? comparison : -comparison;
  });

  const handleEdit = (task: Task) => {
    setActiveTask(task);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    setDeleteTargetId(id);
    setIsConfirmOpen(true);
  };

  const handleAddNew = () => {
    setActiveTask(null);
    setIsModalOpen(true);
  };

  const handleSaveTask = async (input: TaskInput): Promise<boolean> => {
    try {
      const url = activeTask ? `/api/tasks/${activeTask.id}` : "/api/tasks";
      const method = activeTask ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to save task");
      }

      await fetchTasks();
      return true;
    } catch (err: any) {
      alert(err.message || "Something went wrong while saving the task.");
      return false;
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTargetId) return;
    try {
      const res = await fetch(`/api/tasks/${deleteTargetId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to delete task");
      }

      await fetchTasks();
    } catch (err: any) {
      alert(err.message || "Something went wrong while deleting the task.");
    } finally {
      setDeleteTargetId(null);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50">
          Manage Your Tasks
        </h2>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Create, view, search, filter, and track tasks for your projects.
        </p>
      </div>

      <FilterBar
        search={search}
        onSearchChange={setSearch}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        sortBy={sortBy}
        onSortByChange={setSortBy}
        sortOrder={sortOrder}
        onSortOrderChange={setSortOrder}
        onAddNewClick={handleAddNew}
      />

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
          <p className="text-sm text-zinc-500 dark:text-zinc-400">Loading your board...</p>
        </div>
      ) : error ? (
        <div className="flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800 dark:border-red-900/30 dark:bg-red-950/20 dark:text-red-400">
          <AlertCircle className="h-5 w-5" />
          <div>
            <p className="font-semibold">Error</p>
            <p>{error}</p>
            <button
              onClick={fetchTasks}
              className="mt-2 text-xs font-bold underline cursor-pointer"
            >
              Retry
            </button>
          </div>
        </div>
      ) : sortedTasks.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-zinc-200 p-16 text-center dark:border-zinc-800">
          <div className="rounded-full bg-zinc-100 p-4 dark:bg-zinc-900">
            <ClipboardList className="h-8 w-8 text-zinc-400 dark:text-zinc-500" />
          </div>
          <h3 className="mt-4 text-base font-semibold text-zinc-900 dark:text-zinc-100">
            No tasks found
          </h3>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400 max-w-xs">
            {search || statusFilter !== "all"
              ? "Try adjusting your search criteria or status filter tabs."
              : "Get started by adding your first task to the board."}
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sortedTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        task={activeTask}
        onSave={handleSaveTask}
      />

      <ConfirmDialog
        isOpen={isConfirmOpen}
        onClose={() => {
          setIsConfirmOpen(false);
          setDeleteTargetId(null);
        }}
        onConfirm={handleConfirmDelete}
        title="Delete Task"
        message="Are you sure you want to delete this task? This action is permanent and cannot be undone."
        confirmText="Delete Task"
      />
    </div>
  );
}
