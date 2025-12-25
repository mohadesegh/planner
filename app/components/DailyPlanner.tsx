"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
	addDays,
	formatPersianPretty,
	formatPersianWeekdayShort,
	fromDateKey,
	toDateKey,
	weekKeysAround,
} from "app/lib/date";
import { usePlanner } from "app/lib/store";
import { Card } from "./ui";

import TodosSection from "./sections/TodosSection";
import SleepMoodSection from "./sections/SleepMoodSection";
import WaterSection from "./sections/WaterSection";
import MealsSection from "./sections/MealsSection";
import HabitsSection from "./sections/HabitsSection";
import CostsSection from "./sections/CostsSection";
import NotesSection from "./sections/NotesSection";

export default function DailyPlanner() {
	const [selected, setSelected] = useState<string>(toDateKey(new Date()));
	const planner = usePlanner(selected);

	const dateObj = useMemo(() => fromDateKey(selected), [selected]);
	const weekKeys = useMemo(() => weekKeysAround(dateObj), [dateObj]);

	const savedLabel = planner.isDirty ? "Unsaved changes" : "Saved";
	const savedTime = planner.lastSavedAt
		? new Date(planner.lastSavedAt).toLocaleTimeString()
		: "";

	return (
		<div className="space-y-4">
			{/* Header */}
			<Card className="p-4">
				<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
					<div>
						<div
							className="text-xs font-semibold tracking-widest"
							style={{ color: "var(--p-muted)" }}
						>
							TODAY
						</div>
						<div
							className="text-lg font-bold"
							style={{ color: "var(--p-text)" }}
						>
							{formatPersianPretty(dateObj)}
						</div>
						<div className="mt-1 text-xs" style={{ color: "var(--p-muted)" }}>
							{savedLabel}
							{savedTime ? ` • ${savedTime}` : ""}
						</div>
					</div>

					<div className="flex flex-wrap items-center gap-2">
						<button
							className="p-btn rounded-xl px-3 py-2 text-sm hover:opacity-90"
							onClick={() => setSelected(toDateKey(addDays(dateObj, -1)))}
							type="button"
						>
							← 
						</button>

						<button
							className="p-btn-accent rounded-xl px-3 py-2 text-sm hover:opacity-90"
							onClick={() => setSelected(toDateKey(new Date()))}
							type="button"
						>
							Today
						</button>

						<button
							className="p-btn rounded-xl px-3 py-2 text-sm hover:opacity-90"
							onClick={() => setSelected(toDateKey(addDays(dateObj, 1)))}
							type="button"
						>
							 →
						</button>

						<button
							className={
								"rounded-xl px-3 py-2 text-sm hover:opacity-90 " +
								(planner.isDirty ? "p-btn-primary" : "p-btn opacity-70")
							}
							onClick={() => planner.saveNow()}
							disabled={!planner.isDirty}
							type="button"
						>
							Save
						</button>

						<Link
							href="/overview"
							className="p-btn rounded-xl px-3 py-2 text-sm hover:opacity-90"
						>
							Overview →
						</Link>
					</div>
				</div>

				{/* Week picker */}
				<div className="mt-4 flex flex-wrap gap-2">
					{weekKeys.map((k) => {
						const d = fromDateKey(k);
						const label = formatPersianWeekdayShort(d);
						const active = k === selected;

						return (
							<button
								key={k}
								onClick={() => setSelected(k)}
								className={
									"rounded-full px-3 py-1 text-sm hover:opacity-90 " +
									(active ? "p-btn-primary" : "p-chip")
								}
								title={k}
								type="button"
							>
								{label}
							</button>
						);
					})}
				</div>
			</Card>

			{/* layout */}
			<div className="grid gap-4 lg:grid-cols-3">
				<div className="order-1 lg:order-2 lg:col-span-2">
					<TodosSection planner={planner} />
				</div>
				<div className="order-2 lg:order-1">
					<SleepMoodSection planner={planner} />
				</div>
			</div>

			<div className="grid gap-4 lg:grid-cols-2">
				<WaterSection planner={planner} />
				<CostsSection planner={planner} />
			</div>

			<MealsSection planner={planner} />
			<HabitsSection planner={planner} />
			<NotesSection planner={planner} />
		</div>
	);
}
