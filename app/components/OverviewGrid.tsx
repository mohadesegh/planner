"use client";

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
import { useMemo, useState } from "react";
import type { MoodKey } from "app/lib/types";

function sumAmounts(costs: { value: string }[]) {
	let total = 0;
	for (const c of costs) {
		const n = Number(String(c.value).replace(/[^\d.]/g, ""));
		if (Number.isFinite(n)) total += n;
	}
	return total;
}

const MOOD_EMOJI: Record<MoodKey, string> = {
	veryBad: "😞",
	bad: "🙁",
	ok: "😐",
	good: "🙂",
	great: "😄",
};

export default function OverviewGrid() {
	const [anchor, setAnchor] = useState<string>(toDateKey(new Date()));
	const planner = usePlanner(anchor);

	const anchorDate = useMemo(() => fromDateKey(anchor), [anchor]);
	const week = useMemo(() => weekKeysAround(anchorDate), [anchorDate]);

	return (
		<div className="space-y-4">
			<Card className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
				<div>
					<div className="text-xs font-semibold tracking-widest text-gray-600">
						OVERVIEW
					</div>
					<div className="text-sm text-gray-600">
						نمای کلی هفته (اطلاعات ذخیره‌شده)
					</div>
					<div className="mt-1 font-semibold text-gray-900">
						{formatPersianPretty(anchorDate)}
					</div>
				</div>

				<div className="flex gap-2">
					<button
						className="rounded-xl border bg-white px-3 py-2 text-sm"
						onClick={() => setAnchor(toDateKey(addDays(anchorDate, -7)))}
					>
						← هفته قبل
					</button>
					<button
						className="rounded-xl border bg-black px-3 py-2 text-sm text-white"
						onClick={() => setAnchor(toDateKey(new Date()))}
					>
						این هفته
					</button>
					<button
						className="rounded-xl border bg-white px-3 py-2 text-sm"
						onClick={() => setAnchor(toDateKey(addDays(anchorDate, 7)))}
					>
						هفته بعد →
					</button>
				</div>
			</Card>

			<div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
				{week.map((k) => {
					const d = fromDateKey(k);
					const data = planner.getDay(k);

					const doneTodos = data.todos.filter((t) => t.done).length;
					const totalTodos = data.todos.length;
					const water = data.waterCups.filter(Boolean).length;
					const habitsDone = data.habits.filter((h) => h.checked).length;
					const costTotal = sumAmounts(data.costs);

					const weekday = formatPersianWeekdayShort(d);
					const mood = data.mood ? MOOD_EMOJI[data.mood] : "—";
					const sleep = data.sleepHours ?? null;

					return (
						<Card key={k} className="flex flex-col gap-3">
							<div className="flex items-start justify-between gap-2">
								<div>
									<div className="text-sm font-bold text-gray-900">
										{weekday}
									</div>
									<div className="text-xs text-gray-600">
										{formatPersianPretty(d)}
									</div>
								</div>

								<Link
									href={`/?date=${k}`}
									className="rounded-xl border bg-white px-3 py-2 text-sm text-gray-800"
								>
									Open →
								</Link>
							</div>

							<div className="grid grid-cols-3 gap-2 text-sm">
								<div className="rounded-xl border bg-white p-3">
									<div className="text-xs text-gray-600">Water</div>
									<div className="font-semibold text-gray-900">{water}/8</div>
								</div>
								<div className="rounded-xl border bg-white p-3">
									<div className="text-xs text-gray-600">Todos</div>
									<div className="font-semibold text-gray-900">
										{doneTodos}/{totalTodos}
									</div>
								</div>
								<div className="rounded-xl border bg-white p-3">
									<div className="text-xs text-gray-600">Habits</div>
									<div className="font-semibold text-gray-900">
										{habitsDone}
									</div>
								</div>
							</div>

							<div className="grid grid-cols-3 gap-2 text-sm">
								<div className="rounded-xl border bg-white p-3">
									<div className="text-xs text-gray-600">Sleep</div>
									<div className="font-semibold text-gray-900">
										{sleep === null ? "—" : `${sleep}h`}
									</div>
								</div>
								<div className="rounded-xl border bg-white p-3">
									<div className="text-xs text-gray-600">Mood</div>
									<div className="font-semibold text-gray-900 text-lg">
										{mood}
									</div>
								</div>
								<div className="rounded-xl border bg-white p-3">
									<div className="text-xs text-gray-600">Costs</div>
									<div className="font-semibold text-gray-900">
										{costTotal || 0}
									</div>
								</div>
							</div>
						</Card>
					);
				})}
			</div>
		</div>
	);
}
