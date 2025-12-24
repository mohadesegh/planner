"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Card } from "./ui";
import { usePlanner } from "app/lib/store";
import {
	fromDateKey,
	toDateKey,
	addDays,
	formatPersianPretty,
	weekKeysAround,
} from "app/lib/date";
import type { MoodKey, DailyData } from "app/lib/types";

const MOOD_EMOJI: Record<MoodKey, string> = {
	awful: "🤮",
	veryBad: "😞",
	bad: "🙁",
	meh: "😑",
	ok: "😐",
	good: "🙂",
	veryGood: "😃",
	amazing: "🤩",
};

function parseNum(v: string): number {
	const x = Number(String(v).replace(/,/g, "").trim());
	return Number.isFinite(x) ? x : 0;
}

function minutes(v: string) {
	const [h, m] = v.split(":").map(Number);
	return h * 60 + m;
}

function calcSleepMinutes(s: DailyData["sleep"]) {
	if (!s.start || !s.end) return 0;

	const start = minutes(s.start);
	let end = minutes(s.end);
	if (end <= start) end += 1440;

	let total = end - start;

	for (const p of s.pauses) {
		if (!p.start || !p.end) continue;
		const ps = minutes(p.start);
		let pe = minutes(p.end);
		if (pe <= ps) pe += 1440;
		total -= pe - ps;
	}

	return Math.max(0, total);
}

function hmLabel(mins: number) {
	if (!mins) return "—";
	const h = Math.floor(mins / 60);
	const m = mins % 60;
	return `${h}h ${m}m`;
}

function dayTotals(d: DailyData) {
	const waterDone = d.waterCups.filter(Boolean).length;

	const todosDone = d.todos.filter((t) => t.done).length;
	const todosTotal = d.todos.length;

	const habitsDone = d.habits.filter((h) => h.checked).length;
	const habitsTotal = d.habits.length;

	const sleepMins = calcSleepMinutes(d.sleep);

	const mealRows = [
		...d.meals.breakfast,
		...d.meals.lunch,
		...d.meals.snack,
		...d.meals.dinner,
	];
	const calories = mealRows.reduce((sum, r) => sum + parseNum(r.value), 0);

	const costs = d.costs.reduce((sum, r) => sum + parseNum(r.value), 0);

	return {
		waterDone,
		todosDone,
		todosTotal,
		habitsDone,
		habitsTotal,
		sleepMins,
		calories,
		costs,
	};
}

export default function OverviewGrid() {
	const [anchor, setAnchor] = useState(toDateKey(new Date()));

	// We only need db/getDay from store; anchor is fine.
	const planner = usePlanner(anchor);

	const weekKeys = useMemo(() => weekKeysAround(fromDateKey(anchor)), [anchor]);

	const weekDays = useMemo(
		() => weekKeys.map((k) => planner.getDay(k)),
		[weekKeys, planner]
	);

	const weekSummary = useMemo(() => {
		const totals = weekDays.map(dayTotals);

		const calories = totals.reduce((s, x) => s + x.calories, 0);
		const costs = totals.reduce((s, x) => s + x.costs, 0);
		const sleepMins = totals.reduce((s, x) => s + x.sleepMins, 0);

		const todosDone = totals.reduce((s, x) => s + x.todosDone, 0);
		const todosTotal = totals.reduce((s, x) => s + x.todosTotal, 0);

		const habitsDone = totals.reduce((s, x) => s + x.habitsDone, 0);
		const habitsTotal = totals.reduce((s, x) => s + x.habitsTotal, 0);

		const waterDone = totals.reduce((s, x) => s + x.waterDone, 0);
		const waterTotal = totals.length * 8;

		return {
			calories,
			costs,
			sleepMins,
			todosDone,
			todosTotal,
			habitsDone,
			habitsTotal,
			waterDone,
			waterTotal,
		};
	}, [weekDays]);

	return (
		<div className="space-y-4">
			{/* Week header */}
			<Card className="flex flex-wrap items-center justify-between gap-3">
				<div className="flex items-center gap-2">
					<button
						type="button"
						className="p-btn rounded-xl px-3 py-2 text-sm"
						onClick={() =>
							setAnchor(toDateKey(addDays(fromDateKey(anchor), -7)))
						}
					>
						← Prev week
					</button>

					<button
						type="button"
						className="p-btn rounded-xl px-3 py-2 text-sm"
						onClick={() => setAnchor(toDateKey(new Date()))}
					>
						This week
					</button>

					<button
						type="button"
						className="p-btn rounded-xl px-3 py-2 text-sm"
						onClick={() =>
							setAnchor(toDateKey(addDays(fromDateKey(anchor), 7)))
						}
					>
						Next week →
					</button>
				</div>

				<div className="text-sm font-semibold">
					Week of: {formatPersianPretty(fromDateKey(anchor))}
				</div>
			</Card>

			{/* Weekly totals summary */}
			<Card>
				<div
					className="text-xs font-semibold tracking-widest"
					style={{ color: "var(--p-muted)" }}
				>
					WEEK SUMMARY
				</div>

				<div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4 text-sm">
					<div className="p-chip rounded-2xl p-3">
						<div className="text-xs" style={{ color: "var(--p-muted)" }}>
							Sleep total
						</div>
						<div className="font-semibold">
							{hmLabel(weekSummary.sleepMins)}
						</div>
					</div>

					<div className="p-chip rounded-2xl p-3">
						<div className="text-xs" style={{ color: "var(--p-muted)" }}>
							Calories total
						</div>
						<div className="font-semibold">
							{Math.round(weekSummary.calories)}
						</div>
					</div>

					<div className="p-chip rounded-2xl p-3">
						<div className="text-xs" style={{ color: "var(--p-muted)" }}>
							Costs total
						</div>
						<div className="font-semibold">{Math.round(weekSummary.costs)}</div>
					</div>

					<div className="p-chip rounded-2xl p-3">
						<div className="text-xs" style={{ color: "var(--p-muted)" }}>
							Water
						</div>
						<div className="font-semibold">
							{weekSummary.waterDone}/{weekSummary.waterTotal}
						</div>
					</div>

					<div className="p-chip rounded-2xl p-3">
						<div className="text-xs" style={{ color: "var(--p-muted)" }}>
							Todos
						</div>
						<div className="font-semibold">
							{weekSummary.todosDone}/{weekSummary.todosTotal}
						</div>
					</div>

					<div className="p-chip rounded-2xl p-3">
						<div className="text-xs" style={{ color: "var(--p-muted)" }}>
							Habits
						</div>
						<div className="font-semibold">
							{weekSummary.habitsDone}/{weekSummary.habitsTotal}
						</div>
					</div>
				</div>
			</Card>

			{/* Days */}
			<div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
				{weekKeys.map((k) => {
					const d = planner.getDay(k);
					const t = dayTotals(d);

					return (
						<Link key={k} href={`/?date=${k}`} className="block">
							<Card className="transition hover:shadow-md">
								<div className="flex items-start justify-between gap-2">
									<div className="font-semibold">
										{formatPersianPretty(fromDateKey(k))}
									</div>
									<div className="text-lg">
										{d.mood ? MOOD_EMOJI[d.mood] : "—"}
									</div>
								</div>

								<div className="mt-3 grid grid-cols-2 gap-2 text-sm">
									<div className="p-chip rounded-xl p-2">
										<div
											className="text-xs"
											style={{ color: "var(--p-muted)" }}
										>
											Todos
										</div>
										<div className="font-medium">
											{t.todosDone}/{t.todosTotal}
										</div>
									</div>

									<div className="p-chip rounded-xl p-2">
										<div
											className="text-xs"
											style={{ color: "var(--p-muted)" }}
										>
											Habits
										</div>
										<div className="font-medium">
											{t.habitsDone}/{t.habitsTotal}
										</div>
									</div>

									<div className="p-chip rounded-xl p-2">
										<div
											className="text-xs"
											style={{ color: "var(--p-muted)" }}
										>
											Water
										</div>
										<div className="font-medium">{t.waterDone}/8</div>
									</div>

									<div className="p-chip rounded-xl p-2">
										<div
											className="text-xs"
											style={{ color: "var(--p-muted)" }}
										>
											Sleep
										</div>
										<div className="font-medium">{hmLabel(t.sleepMins)}</div>
									</div>

									<div className="p-chip rounded-xl p-2">
										<div
											className="text-xs"
											style={{ color: "var(--p-muted)" }}
										>
											Calories
										</div>
										<div className="font-medium">{Math.round(t.calories)}</div>
									</div>

									<div className="p-chip rounded-xl p-2">
										<div
											className="text-xs"
											style={{ color: "var(--p-muted)" }}
										>
											Costs
										</div>
										<div className="font-medium">{Math.round(t.costs)}</div>
									</div>
								</div>

								<div
									className="mt-3 text-xs"
									style={{ color: "var(--p-muted)" }}
								>
									Click to open this day
								</div>
							</Card>
						</Link>
					);
				})}
			</div>
		</div>
	);
}
