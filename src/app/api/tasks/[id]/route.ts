import { NextResponse } from "next/server";
import { updateTask, deleteTask } from "@/lib/db";
import type { TaskInput } from "@/types/task";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { title, description, status, priority, dueDate } = body as Partial<TaskInput>;

    // Simple validation
    const errors: Record<string, string> = {};

    if (title !== undefined) {
      if (typeof title !== "string") {
        errors.title = "Title must be a string";
      } else if (title.trim().length < 3) {
        errors.title = "Title must be at least 3 characters long";
      }
    }

    if (status !== undefined && !["todo", "in-progress", "done"].includes(status)) {
      errors.status = "Status must be either 'todo', 'in-progress', or 'done'";
    }

    if (priority !== undefined && !["low", "medium", "high"].includes(priority)) {
      errors.priority = "Priority must be either 'low', 'medium', or 'high'";
    }

    if (Object.keys(errors).length > 0) {
      return NextResponse.json({ errors }, { status: 400 });
    }

    const updated = await updateTask(id, {
      ...(title !== undefined && { title: title.trim() }),
      ...(description !== undefined && { description: description?.trim() || undefined }),
      ...(status !== undefined && { status: status as any }),
      ...(priority !== undefined && { priority: priority as any }),
      ...(dueDate !== undefined && { dueDate: dueDate || undefined }),
    });

    if (!updated) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (error) {
    console.error("PUT /api/tasks/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to update task" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const deleted = await deleteTask(id);

    if (!deleted) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/tasks/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to delete task" },
      { status: 500 }
    );
  }
}
