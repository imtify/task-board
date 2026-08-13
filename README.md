# Task Board

A premium task manager (mini Trello/Todo) built with Next.js 16 and Tailwind CSS 4.

This project is built incrementally with structured commits to demonstrate clean folder structure, separation of concerns, TypeScript compliance, and robust error handling.

## Tech Stack

- **Framework**: Next.js 16 (App Router, Turbopack)
- **Library**: React 19 (Functional components + hooks only)
- **Styling**: Tailwind CSS 4 & Vanilla CSS variables
- **Icons**: Lucide React
- **Testing**: Vitest (Unit tests)
- **Language**: TypeScript (Strict typing)

## Features Implemented

### Core Features
1. **Task List Page (`/`)**: Displays all tasks in a highly responsive cards grid.
2. **Badge Metadata**: Colored badges showing task Status (`To Do`, `In Progress`, `Done`) and Priority (`Low`, `Medium`, `High`). Overdue dates are highlighted.
3. **Task Creation**: Combined modal form with validation (title is required, min 3 characters; description, status, priority, and due dates are customizable).
4. **Task Editing**: Allows live updating of all fields in any existing task, persisting on save.
5. **Task Deletion**: Allows deleting tasks. Features an interactive Confirm dialog overlay before deletion.
6. **Filter & Search**:
   - Filter tasks by status tab choices (All, To Do, In Progress, Done).
   - Case-insensitive search of tasks by title.
7. **Persistence**:
   - Data persists across server restarts and page refreshes **in local development**, backed by a local JSON file (`data/tasks.json`) accessed via server API endpoints. See the note on deployed persistence below.

### Bonus Features
- **Sorting**: Multi-parameter sorting support (by Date Created, Due Date, or Priority rank) with order toggles (ascending/descending).
- **Responsive Layout**: Designed for mobile devices and high-DPI monitors.
- **Dark Mode**: Integrated manual Light/Dark mode switcher with localStorage persistence and page-load flash prevention.
- **Empty / Loading States**: Displays loading skeletons during API interactions and responsive illustrations when search returns no matching tasks.
- **Unit Tests**: Full unit test coverage of utility functions using Vitest.

## Project Structure

```
task-board/
├── data/
│   └── tasks.json            # Local JSON database storage
├── src/
│   ├── app/                  # routes (Next.js App Router)
│   │   ├── api/
│   │   │   └── tasks/
│   │   │       ├── route.ts         # GET & POST routes
│   │   │       └── [id]/
│   │   │           └── route.ts     # PUT & DELETE routes
│   │   ├── globals.css       # Tailwind 4 and color scheme configuration
│   │   └── layout.tsx        # Shell layout & dark mode flash prevention script
│   ├── components/
│   │   ├── tasks/
│   │   │   ├── FilterBar.tsx # Title search, status tabs, sorting select controls
│   │   │   ├── TaskCard.tsx  # Individual task renderer with overdue checks
│   │   │   └── TaskModal.tsx # Dual-purpose create and edit task form
│   │   └── ui/
│   │       ├── Badge.tsx     # Colored labels component
│   │       ├── ConfirmDialog.tsx # Deletion warning overlay dialog
│   │       ├── Modal.tsx     # Generic popup container (handles Esc key, click-outside)
│   │       └── ThemeToggle.tsx   # Light/Dark mode reactive button
│   ├── lib/
│   │   ├── constants.ts      # Shared status/priority config options & badge styling
│   │   ├── db.ts             # Local JSON file read/write database layer
│   │   └── taskUtils.ts      # Reusable business logic (overdue & sorting calculations)
│   └── types/
│       └── task.ts           # Types for Task, TaskInput, Statuses, Priorities
```

## Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Start the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Run Unit Tests
```bash
npm run test
```

### 4. Build for Production
```bash
npm run build
```

## Assumptions & Notes

1. **Storage Choice**: We used a local JSON file database (`data/tasks.json`) on the server. If this file does not exist, it is auto-generated with mock seed data, making it instant to run and test locally.
2. **Next.js 15/16 App Router Dynamic Params**: In Next.js 15+, dynamic route params (like `params` inside route handlers) are Promise-wrapped. We correctly typed and awaited `params` in `src/app/api/tasks/[id]/route.ts`.
3. **Tailwind 4 Class-Based Dark Mode**: Used the custom `@variant dark (&:where(.dark, .dark *));` directive to link Tailwind 4's dark class toggle utility to class names rather than media queries.
4. **Deployed (Vercel) Persistence Limitation**: The JSON file store works reliably in local development, but Vercel's serverless functions run on a read-only filesystem — writes (create/edit/delete) do not persist on the live demo between requests. This is a known constraint of file-based storage on serverless platforms, not a bug. A production deployment would swap this for a real database (e.g. Postgres/Supabase) or client-side `localStorage`, both of which the assignment allows as acceptable storage options.
