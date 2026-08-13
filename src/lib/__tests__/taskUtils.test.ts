import { describe, it, expect } from "vitest";
import { isTaskOverdue, getPriorityRank } from "../taskUtils";

describe("taskUtils", () => {
  describe("isTaskOverdue", () => {
    it("should return false if task has no due date", () => {
      const task = { status: "todo" };
      expect(isTaskOverdue(task)).toBe(false);
    });

    it("should return false if task is already done", () => {
      const task = { dueDate: "2026-08-10", status: "done" };
      const refDate = new Date("2026-08-12");
      expect(isTaskOverdue(task, refDate)).toBe(false);
    });

    it("should return true if due date is in the past", () => {
      const task = { dueDate: "2026-08-10", status: "todo" };
      const refDate = new Date("2026-08-12");
      expect(isTaskOverdue(task, refDate)).toBe(true);
    });

    it("should return false if due date is today", () => {
      const task = { dueDate: "2026-08-12", status: "in-progress" };
      const refDate = new Date("2026-08-12T15:00:00Z");
      expect(isTaskOverdue(task, refDate)).toBe(false);
    });

    it("should return false if due date is in the future", () => {
      const task = { dueDate: "2026-08-15", status: "todo" };
      const refDate = new Date("2026-08-12");
      expect(isTaskOverdue(task, refDate)).toBe(false);
    });
  });

  describe("getPriorityRank", () => {
    it("should return correct ranks", () => {
      expect(getPriorityRank("high")).toBe(3);
      expect(getPriorityRank("medium")).toBe(2);
      expect(getPriorityRank("low")).toBe(1);
    });

    it("should return 0 for unknown priority", () => {
      expect(getPriorityRank("unknown" as any)).toBe(0);
    });
  });
});
