"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const SECTIONS = [
  { id: "todos", label: "Todos" },
  { id: "sleep", label: "Sleep & Mood" },
  { id: "water", label: "Water" },
  { id: "meals", label: "Meals" },
  { id: "costs", label: "Costs" },
  { id: "habits", label: "Habits" },
  { id: "notes", label: "Notes" },
];

export default function PlannerShell({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const isDaily = path === "/";
  const isOverview = path?.startsWith("/overview");

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-6xl px-4 py-6">
        <header className="mb-6 space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="text-2xl font-bold">Planner</div>
              <div className="text-sm" style={{ color: "var(--p-muted)" }}>
                Daily planner + overview (press Save)
              </div>
            </div>

            <nav className="flex gap-2">
              <Link
                href="/"
                className={
                  "rounded-xl px-4 py-2 text-sm font-medium transition " +
                  (isDaily ? "p-btn-primary" : "p-btn hover:opacity-90")
                }
              >
                Daily
              </Link>

              <Link
                href="/overview"
                className={
                  "rounded-xl px-4 py-2 text-sm font-medium transition " +
                  (isOverview ? "p-btn-primary" : "p-btn hover:opacity-90")
                }
              >
                Overview
              </Link>
            </nav>
          </div>

        </header>

        <main>{children}</main>
      </div>
    </div>
  );
}
