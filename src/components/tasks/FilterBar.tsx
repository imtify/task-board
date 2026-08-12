import React from "react";
import { Search, SlidersHorizontal, Plus } from "lucide-react";
import { STATUS_OPTIONS } from "@/lib/constants";
import type { TaskStatus } from "@/types/task";

interface FilterBarProps {
  search: string;
  onSearchChange: (val: string) => void;
  statusFilter: TaskStatus | "all";
  onStatusFilterChange: (val: TaskStatus | "all") => void;
  sortBy: string;
  onSortByChange: (val: any) => void;
  sortOrder: "asc" | "desc";
  onSortOrderChange: (val: "asc" | "desc") => void;
  onAddNewClick: () => void;
}

export function FilterBar({
  search,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  sortBy,
  onSortByChange,
  sortOrder,
  onSortOrderChange,
  onAddNewClick,
}: FilterBarProps) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-b border-zinc-200 dark:border-zinc-800 pb-5">
      {/* Search and Filters */}
      <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400 dark:text-zinc-500" />
          <input
            type="text"
            placeholder="Search tasks by title..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full rounded-lg border border-zinc-200 bg-white py-2 pl-9 pr-4 text-sm outline-hidden focus:border-amber-500 focus:ring-1 focus:ring-amber-500 dark:border-zinc-800 dark:bg-zinc-950 dark:focus:border-amber-500 dark:focus:ring-amber-500 transition-colors"
          />
        </div>

        {/* Status Filters */}
        <div className="flex flex-wrap gap-1 bg-zinc-100 dark:bg-zinc-900 p-1 rounded-lg">
          <button
            onClick={() => onStatusFilterChange("all")}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
              statusFilter === "all"
                ? "bg-white text-zinc-900 shadow-xs dark:bg-zinc-800 dark:text-zinc-100"
                : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200"
            }`}
          >
            All
          </button>
          {STATUS_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => onStatusFilterChange(opt.value)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                statusFilter === opt.value
                  ? "bg-white text-zinc-900 shadow-xs dark:bg-zinc-800 dark:text-zinc-100"
                  : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Sorting and Add Button */}
      <div className="flex items-center gap-3">
        {/* Sort Select */}
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-zinc-400" />
          <select
            value={sortBy}
            onChange={(e) => onSortByChange(e.target.value)}
            className="rounded-lg border border-zinc-200 bg-white py-1.5 px-3 text-xs outline-hidden focus:border-amber-500 dark:border-zinc-800 dark:bg-zinc-950 text-zinc-700 dark:text-zinc-300 focus:ring-1 focus:ring-amber-500"
          >
            <option value="createdAt">Date Created</option>
            <option value="dueDate">Due Date</option>
            <option value="priority">Priority</option>
          </select>
          <button
            onClick={() => onSortOrderChange(sortOrder === "asc" ? "desc" : "asc")}
            className="rounded-lg border border-zinc-200 bg-white p-1.5 text-xs text-zinc-600 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400 dark:hover:bg-zinc-900 transition-colors"
            title={sortOrder === "asc" ? "Sort Descending" : "Sort Ascending"}
          >
            {sortOrder === "asc" ? "▲" : "▼"}
          </button>
        </div>

        {/* Add Task Button */}
        <button
          onClick={onAddNewClick}
          className="inline-flex items-center gap-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors duration-150 cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          Add Task
        </button>
      </div>
    </div>
  );
}
