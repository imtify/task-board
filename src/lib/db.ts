import fs from "fs/promises";
import path from "path";
import type { Task, TaskInput } from "@/types/task";

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "tasks.json");

// Initial mock tasks to seed the board
const SEED_TASKS: Task[] = [
  {
    id: "task-1",
    title: "Design UI Layout",
    description: "Create Figma wireframes and design system for the task manager dashboard.",
    status: "done",
    priority: "high",
    dueDate: "2026-08-15",
    createdAt: new Date("2026-08-10T10:00:00Z").toISOString(),
    updatedAt: new Date("2026-08-10T12:00:00Z").toISOString(),
  },
  {
    id: "task-2",
    title: "Implement Task API routes",
    description: "Set up Next.js API router endpoints with local JSON file persistence.",
    status: "in-progress",
    priority: "medium",
    dueDate: "2026-08-18",
    createdAt: new Date("2026-08-12T08:00:00Z").toISOString(),
    updatedAt: new Date("2026-08-12T08:00:00Z").toISOString(),
  },
  {
    id: "task-3",
    title: "Write unit tests for filters",
    description: "Create test coverage using Vitest for search and filter functions.",
    status: "todo",
    priority: "low",
    dueDate: "2026-08-25",
    createdAt: new Date("2026-08-12T09:00:00Z").toISOString(),
    updatedAt: new Date("2026-08-12T09:00:00Z").toISOString(),
  },
];

async function ensureDataFile() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    try {
      await fs.access(DATA_FILE);
    } catch {
      // File does not exist, create it with seed data
      await fs.writeFile(DATA_FILE, JSON.stringify(SEED_TASKS, null, 2), "utf-8");
    }
  } catch (error) {
    console.error("Error creating database folder/file:", error);
  }
}

export async function getTasks(): Promise<Task[]> {
  await ensureDataFile();
  try {
    const data = await fs.readFile(DATA_FILE, "utf-8");
    return JSON.parse(data) as Task[];
  } catch (error) {
    console.error("Error reading tasks:", error);
    return [];
  }
}

export async function saveTasks(tasks: Task[]): Promise<void> {
  await ensureDataFile();
  try {
    await fs.writeFile(DATA_FILE, JSON.stringify(tasks, null, 2), "utf-8");
  } catch (error) {
    console.error("Error saving tasks:", error);
  }
}

export async function createTask(input: TaskInput): Promise<Task> {
  const tasks = await getTasks();
  const now = new Date().toISOString();
  const newTask: Task = {
    id: `task-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
    ...input,
    createdAt: now,
    updatedAt: now,
  };
  tasks.push(newTask);
  await saveTasks(tasks);
  return newTask;
}

export async function updateTask(id: string, input: Partial<TaskInput>): Promise<Task | null> {
  const tasks = await getTasks();
  const index = tasks.findIndex((t) => t.id === id);
  if (index === -1) return null;

  const now = new Date().toISOString();
  const updatedTask: Task = {
    ...tasks[index],
    ...input,
    updatedAt: now,
  };
  tasks[index] = updatedTask;
  await saveTasks(tasks);
  return updatedTask;
}

export async function deleteTask(id: string): Promise<boolean> {
  const tasks = await getTasks();
  const filteredTasks = tasks.filter((t) => t.id !== id);
  if (filteredTasks.length === tasks.length) return false;
  await saveTasks(filteredTasks);
  return true;
}
