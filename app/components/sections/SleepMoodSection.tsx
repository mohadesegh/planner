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
			<div className="space-y-5">
				<div className="p-card rounded-2xl p-4">
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

					<div className="mt-2 p-chip rounded-xl p-2 text-sm">
						Total sleep: <b>{planner.sleepTotalLabel}</b>
					</div>
				</div>

				<div className="p-card rounded-2xl p-4">
					<div className="flex items-center justify-between">
						<Label>Pauses</Label>
						<button
							type="button"
							className="p-btn-primary rounded-xl px-3 py-2 text-sm hover:opacity-90"
							onClick={() => planner.addSleepPause()}
						>
							+ Add pause
						</button>
					</div>

					<div className="mt-2 space-y-2">
						{planner.day.sleep.pauses.length === 0 ? (
							<div className="text-xs" style={{ color: "var(--p-muted)" }}>
								No pauses added.
							</div>
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
									className="p-btn rounded-xl px-3 py-2 hover:opacity-90"
									onClick={() => planner.removeSleepPause(p.id)}
								>
									🗑️
								</button>
							</div>
						))}
					</div>
				</div>

				<div className="p-card rounded-2xl p-4">
					<Label>Mood</Label>
					<div className="mt-2 grid grid-cols-4 gap-2">
						{MOODS.map((m) => {
							const active = planner.day.mood === m.key;
							return (
								<button
									key={m.key}
									type="button"
									className={
										"rounded-xl border p-2 text-sm transition hover:opacity-90 " +
										(active ? "p-btn-primary" : "p-btn")
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
