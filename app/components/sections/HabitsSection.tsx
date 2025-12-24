"use client";

import AccordionSection from "../AccordionSection";
import { IconCheck, Input } from "../ui";
import { usePlanner } from "app/lib/store";

type Planner = ReturnType<typeof usePlanner>;

export default function HabitsSection({ planner }: { planner: Planner }) {
	const done = planner.day.habits.filter((h) => h.checked).length;
	const total = planner.day.habits.length;

	return (
		<AccordionSection
			title="HABITS"
			subtitle={`Add habits, check them, set priority and order • ${done}/${total} done`}
			defaultOpen={false}
			rightSlot={
				<div className="flex gap-2">
					<button
						type="button"
						className="p-btn-primary rounded-xl px-3 py-2 text-sm transition hover:opacity-90"
						onClick={(e) => {
							e.stopPropagation();
							planner.addHabit("");
						}}
					>
						+ Add habit
					</button>
					<button
						type="button"
						className="p-btn rounded-xl px-3 py-2 text-sm transition hover:opacity-90"
						onClick={(e) => {
							e.stopPropagation();
							planner.sortHabitsByPriority();
						}}
					>
						Sort
					</button>
				</div>
			}
		>
			<div className="space-y-2">
				{planner.day.habits.length === 0 ? (
					<div
						className="p-card rounded-xl p-3 text-sm"
						style={{ color: "var(--p-muted)" }}
					>
						No habits yet.
					</div>
				) : null}

				{planner.day.habits.map((h) => (
					<div key={h.id} className="p-card rounded-2xl p-2">
						<div className="flex flex-wrap items-center gap-2">
							<button
								type="button"
								onClick={() =>
									planner.updateHabit(h.id, { checked: !h.checked })
								}
								className="shrink-0"
								aria-label="toggle habit"
							>
								<IconCheck checked={h.checked} />
							</button>

							<div className="w-24">
								<Input
									type="number"
									value={h.priority}
									onChange={(e) =>
										planner.updateHabit(h.id, {
											priority: Number(e.target.value || 999),
										})
									}
								/>
							</div>

							<div className="flex-1 min-w-[220px]">
								<Input
									value={h.title}
									onChange={(e) =>
										planner.updateHabit(h.id, { title: e.target.value })
									}
									placeholder="Habit name..."
								/>
							</div>

							<div className="flex gap-2">
								<button
									type="button"
									className="p-btn rounded-xl px-3 py-2 transition hover:opacity-90"
									onClick={() => planner.moveHabit(h.id, "up")}
									aria-label="move habit up"
								>
									↑
								</button>
								<button
									type="button"
									className="p-btn rounded-xl px-3 py-2 transition hover:opacity-90"
									onClick={() => planner.moveHabit(h.id, "down")}
									aria-label="move habit down"
								>
									↓
								</button>
							</div>

							<button
								type="button"
								className="p-btn rounded-xl px-3 py-2 transition hover:opacity-90"
								onClick={() => planner.removeHabit(h.id)}
								aria-label="delete habit"
							>
								🗑️
							</button>
						</div>
					</div>
				))}
			</div>
		</AccordionSection>
	);
}
