import { NextResponse } from "next/server";
import { getTasks, createTask } from "@/lib/db";
import type { TaskInput } from "@/types/task";

export async function GET() {
  try {
    const tasks = await getTasks();
    // Return sorted by createdAt descending as a default
    const sortedTasks = [...tasks].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    return NextResponse.json(sortedTasks);
  } catch (error) {
    console.error("GET /api/tasks error:", error);
    return NextResponse.json(
      { error: "Failed to fetch tasks" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, description, status, priority, dueDate } = body as Partial<TaskInput>;

    // Simple validation
    const errors: Record<string, string> = {};

    if (!title || typeof title !== "string") {
      errors.title = "Title is required";
    } else if (title.trim().length < 3) {
      errors.title = "Title must be at least 3 characters long";
    }

    if (!status || !["todo", "in-progress", "done"].includes(status)) {
      errors.status = "Status must be either 'todo', 'in-progress', or 'done'";
    }

    if (!priority || !["low", "medium", "high"].includes(priority)) {
      errors.priority = "Priority must be either 'low', 'medium', or 'high'";
    }

    if (Object.keys(errors).length > 0) {
      return NextResponse.json({ errors }, { status: 400 });
    }

    const newTask = await createTask({
      title: title!.trim(),
      description: description?.trim() || undefined,
      status: status as any,
      priority: priority as any,
      dueDate: dueDate || undefined,
    });

    return NextResponse.json(newTask, { status: 201 });
  } catch (error) {
    console.error("POST /api/tasks error:", error);
    return NextResponse.json(
      { error: "Failed to create task" },
      { status: 500 }
    );
  }
}
