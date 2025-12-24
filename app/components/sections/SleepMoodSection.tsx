"use client";

import AccordionSection from "../AccordionSection";
import { Input, Label } from "../ui";
import { usePlanner } from "app/lib/store";
import type { MoodKey } from "app/lib/types";

type Planner = ReturnType<typeof usePlanner>;

const MOODS: { key: MoodKey; label: string; emoji: string }[] = [
	{ key: "awful", label: "Awful", emoji: "🤮" },
	{ key: "veryBad", label: "Very bad", emoji: "😞" },
	{ key: "bad", label: "Bad", emoji: "🙁" },
	{ key: "meh", label: "Meh", emoji: "😑" },
	{ key: "ok", label: "OK", emoji: "😐" },
	{ key: "good", label: "Good", emoji: "🙂" },
	{ key: "veryGood", label: "Very good", emoji: "😃" },
	{ key: "amazing", label: "Amazing", emoji: "🤩" },
];

export default function SleepMoodSection({ planner }: { planner: Planner }) {
	return (
		<AccordionSection
			title="SLEEP / MOOD"
			subtitle="Track sleep window, pauses, and mood"
			defaultOpen={true}
		>
			<div className="space-y-5 text-black">
				<div>
					<Label>Sleep start / end</Label>
					<div className="mt-2 grid grid-cols-2 gap-2">
						<Input
							type="time"
							value={planner.day.sleep.start ?? ""}
							onChange={(e) => planner.setSleepStart(e.target.value || null)}
						/>
						<Input
							type="time"
							value={planner.day.sleep.end ?? ""}
							onChange={(e) => planner.setSleepEnd(e.target.value || null)}
						/>
					</div>

					<div className="mt-2 rounded-xl border bg-gray-50 p-2 text-sm text-gray-800">
						Total sleep: <b>{planner.sleepTotalLabel}</b>
					</div>
				</div>

				<div>
					<div className="flex items-center justify-between">
						<Label>Pauses</Label>
						<button
							type="button"
							className="rounded-xl border bg-black px-3 py-2 text-sm text-white"
							onClick={() => planner.addSleepPause()}
						>
							+ Add pause
						</button>
					</div>

					<div className="mt-2 space-y-2">
						{planner.day.sleep.pauses.length === 0 ? (
							<div className="text-xs text-gray-500">No pauses added.</div>
						) : null}

						{planner.day.sleep.pauses.map((p) => (
							<div key={p.id} className="flex items-center gap-2">
								<Input
									type="time"
									value={p.start}
									onChange={(e) =>
										planner.updateSleepPause(p.id, { start: e.target.value })
									}
								/>
								<Input
									type="time"
									value={p.end}
									onChange={(e) =>
										planner.updateSleepPause(p.id, { end: e.target.value })
									}
								/>
								<button
									type="button"
									className="rounded-xl border bg-white px-3 py-2"
									onClick={() => planner.removeSleepPause(p.id)}
								>
									🗑️
								</button>
							</div>
						))}
					</div>
				</div>

				<div>
					<Label>Mood</Label>
					<div className="mt-2 grid grid-cols-4 gap-2">
						{MOODS.map((m) => {
							const active = planner.day.mood === m.key;
							return (
								<button
									key={m.key}
									type="button"
									className={
										"rounded-xl border p-2 text-sm " +
										(active ? "bg-black text-white" : "bg-white text-gray-800")
									}
									onClick={() => planner.setMood(active ? null : m.key)}
									title={m.label}
								>
									<div className="text-xl">{m.emoji}</div>
									<div className="text-xs">{m.label}</div>
								</button>
							);
						})}
					</div>
				</div>
			</div>
		</AccordionSection>
	);
}
