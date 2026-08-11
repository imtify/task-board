# Task Board

A small task manager (mini Trello/Todo) built with Next.js.

> Status: project scaffolding only. Features (task list, create/edit form,
> delete, filter/search, persistence) are being added incrementally — see
> commit history.

## Tech Stack

- Next.js 16 (App Router, Turbopack)
- React 19
- TypeScript
- Tailwind CSS v4
- ESLint

## Project Structure

```
src/
  app/            # routes (App Router)
    api/tasks/     # API route(s) for task CRUD (to be added)
  components/
    tasks/        # task-specific components (list, card, form, filters)
    ui/           # small reusable UI primitives (button, badge, modal, etc.)
  lib/            # constants, helpers, data access
  types/          # shared TypeScript types (Task, TaskStatus, TaskPriority)
```

## Getting Started

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Assumptions / Notes

- Data will be stored via Next.js API routes backed by an in-memory
  array (no external database), per the assignment's "no real database
  needed" note.
- Dropped `next/font/google` in favor of a system font stack to avoid a
  network dependency during build.

## Roadmap (in progress)

- [ ] Task List page (grid/list with status + priority badges)
- [ ] Create Task form with validation
- [ ] Edit Task
- [ ] Delete Task with confirmation
- [ ] Filter by status + search by title
- [ ] Persistence via API routes + in-memory store
- [ ] Bonus: sorting, empty/loading states, dark mode toggle, responsive design
