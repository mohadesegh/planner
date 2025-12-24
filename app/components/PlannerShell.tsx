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

export default function PlannerShell({
	children,
}: {
	children: React.ReactNode;
}) {
	const path = usePathname();
	const isDaily = path === "/";
	const isOverview = path?.startsWith("/overview");

	return (
		<div className="min-h-screen bg-gradient-to-br from-emerald-200 via-teal-200 to-amber-100">
			<div className="mx-auto max-w-6xl px-4 py-6">
				{/* ---------- HEADER ---------- */}
				<header className="mb-6 space-y-4">
					{/* Top row */}
					<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
						<div>
							<div className="text-2xl font-bold text-gray-900">Planner</div>
							<div className="text-sm text-gray-700">
								Daily planner with sleep, mood, habits, meals, and overview
							</div>
						</div>

						<nav className="flex gap-2">
							<Link
								href="/"
								className={
									"rounded-xl border px-4 py-2 text-sm font-medium transition " +
									(isDaily
										? "bg-black text-white"
										: "bg-white text-gray-800 hover:bg-gray-100")
								}
							>
								Daily
							</Link>

							<Link
								href="/overview"
								className={
									"rounded-xl border px-4 py-2 text-sm font-medium transition " +
									(isOverview
										? "bg-black text-white"
										: "bg-white text-gray-800 hover:bg-gray-100")
								}
							>
								Overview
							</Link>
						</nav>
					</div>

					{/* ---------- SECTION BAR (Daily only) ---------- */}
					{isDaily && (
						<div className="flex flex-wrap gap-2 rounded-2xl border bg-white/70 p-3 backdrop-blur">
							{SECTIONS.map((s) => (
								<span
									key={s.id}
									className="rounded-full border bg-white px-3 py-1 text-xs font-medium text-gray-700"
								>
									{s.label}
								</span>
							))}
						</div>
					)}
				</header>

				{/* ---------- PAGE CONTENT ---------- */}
				<main>{children}</main>
			</div>
		</div>
	);
}
