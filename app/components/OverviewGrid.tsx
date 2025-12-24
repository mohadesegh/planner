"use client";

import { useState } from "react";
import { Card } from "./ui";
import { usePlanner } from "app/lib/store";
import {
	fromDateKey,
	toDateKey,
	addDays,
	formatPersianPretty,
	weekKeysAround,
} from "app/lib/date";

const MOOD_EMOJI = {
	awful: "🤮",
	veryBad: "😞",
	bad: "🙁",
	meh: "😑",
	ok: "😐",
	good: "🙂",
	veryGood: "😃",
	amazing: "🤩",
};

export default function OverviewGrid() {
	const [anchor, setAnchor] = useState(toDateKey(new Date()));
	const planner = usePlanner(anchor);
	const week = weekKeysAround(fromDateKey(anchor));

	return (
		<div className="space-y-4">
			<Card className="flex justify-between">
				<button
					onClick={() => setAnchor(toDateKey(addDays(fromDateKey(anchor), -7)))}
				>
					←
				</button>
				<div>{formatPersianPretty(fromDateKey(anchor))}</div>
				<button
					onClick={() => setAnchor(toDateKey(addDays(fromDateKey(anchor), 7)))}
				>
					→
				</button>
			</Card>

			<div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
				{week.map((k) => {
					const d = planner.getDay(k);
					return (
						<Card key={k}>
							<div className="font-semibold">
								{formatPersianPretty(fromDateKey(k))}
							</div>
							<div>
								Todos: {d.todos.filter((t) => t.done).length}/{d.todos.length}
							</div>
							<div>Sleep: {d.sleep.start && d.sleep.end ? "✔" : "—"}</div>
							<div>Mood: {d.mood ? MOOD_EMOJI[d.mood] : "—"}</div>
						</Card>
					);
				})}
			</div>
		</div>
	);
}
