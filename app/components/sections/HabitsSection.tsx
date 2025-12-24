"use client";

import AccordionSection from "../AccordionSection";
import { IconCheck, Input } from "../ui";
import { usePlanner } from "app/lib/store";

type Planner = ReturnType<typeof usePlanner>;

export default function HabitsSection({ planner }: { planner: Planner }) {
	return (
		<AccordionSection
			title="HABITS"
			subtitle="Add habits, check them, set priority and order"
			defaultOpen={false}
			rightSlot={
				<div className="flex gap-2">
					<button
						type="button"
						className="rounded-xl border bg-black px-3 py-2 text-sm text-white"
						onClick={(e) => {
							e.stopPropagation();
							planner.addHabit("");
						}}
					>
						+ Add habit
					</button>
					<button
						type="button"
						className="rounded-xl border bg-white px-3 py-2 text-sm text-gray-800"
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
					<div className="rounded-xl border bg-white p-3 text-sm text-gray-500">
						No habits yet.
					</div>
				) : null}

				{planner.day.habits.map((h) => (
					<div
						key={h.id}
						className="flex flex-wrap items-center gap-2 rounded-2xl border bg-white p-2"
					>
						<button
							type="button"
							onClick={() => planner.updateHabit(h.id, { checked: !h.checked })}
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
								className="rounded-xl border bg-white px-3 py-2"
								onClick={() => planner.moveHabit(h.id, "up")}
							>
								↑
							</button>
							<button
								type="button"
								className="rounded-xl border bg-white px-3 py-2"
								onClick={() => planner.moveHabit(h.id, "down")}
							>
								↓
							</button>
						</div>

						<button
							type="button"
							className="rounded-xl border bg-white px-3 py-2"
							onClick={() => planner.removeHabit(h.id)}
						>
							🗑️
						</button>
					</div>
				))}
			</div>
		</AccordionSection>
	);
}
