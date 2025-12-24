"use client";

import { useMemo, useState } from "react";
import AccordionSection from "../AccordionSection";
import { IconCheck, Input } from "../ui";
import { usePlanner } from "app/lib/store";

type Planner = ReturnType<typeof usePlanner>;

function safeText(s: string, fallback: string) {
	const t = (s ?? "").trim();
	return t.length ? t : fallback;
}

export default function HabitsSection({ planner }: { planner: Planner }) {
	const [edit, setEdit] = useState(false);

	const done = planner.day.habits.filter((h) => h.checked).length;
	const total = planner.day.habits.length;

	// Sort by priority for display (like your paper order)
	const habits = useMemo(() => {
		return [...planner.day.habits].sort(
			(a, b) => (a.priority ?? 999) - (b.priority ?? 999)
		);
	}, [planner.day.habits]);

	return (
		<AccordionSection
			title="HABITS"
			subtitle={`${done}/${total} done • Tap to check`}
			defaultOpen={false}
			rightSlot={
				<div className="flex gap-2">
					<button
						type="button"
						className="p-btn-primary rounded-xl px-3 py-2 text-sm transition hover:opacity-90"
						onClick={(e) => {
							e.stopPropagation();
							// adds a new habit (user edits it)
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
							setEdit((v) => !v);
						}}
					>
						{edit ? "Done" : "Edit"}
					</button>
				</div>
			}
		>
			{habits.length === 0 ? (
				<div
					className="p-card rounded-xl p-3 text-sm"
					style={{ color: "var(--p-muted)" }}
				>
					No habits yet. Click <b>Add habit</b>.
				</div>
			) : null}

			{/* ✅ same layout style as your old version */}
			<div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
				{habits.map((h) => {
					const emoji = safeText(h.icon ?? "", "⭐");
					const title = safeText(h.title, "New habit");
					const subtitle = " "; // keep space so card height feels consistent (like old layout)

					return (
						<div
							key={h.id}
							className="p-card rounded-2xl border p-3"
							style={{ borderColor: "var(--p-border)" }}
						>
							{/* VIEW MODE */}
							{!edit ? (
								<button
									type="button"
									onClick={() =>
										planner.updateHabit(h.id, { checked: !h.checked })
									}
									className="w-full text-left"
								>
									<div className="flex items-center justify-between gap-3">
										<div className="flex items-center gap-3">
											<span className="text-xl">{emoji}</span>
											<div>
												<div
													className="text-sm font-semibold"
													style={{ color: "var(--p-text)" }}
												>
													{title}
												</div>
												<div
													className="text-xs"
													style={{ color: "var(--p-muted)" }}
												>
													{subtitle}
												</div>
											</div>
										</div>

										<IconCheck checked={h.checked} />
									</div>
								</button>
							) : (
								/* EDIT MODE */
								<div className="space-y-2">
									<div className="flex items-center gap-2">
										<div className="w-16">
											<Input
												value={h.icon ?? ""}
												onChange={(e) =>
													planner.updateHabit(h.id, { icon: e.target.value })
												}
												placeholder="💊"
											/>
										</div>

										<div className="flex-1 min-w-[180px]">
											<Input
												value={h.title}
												onChange={(e) =>
													planner.updateHabit(h.id, { title: e.target.value })
												}
												placeholder="Habit title..."
											/>
										</div>

										<button
											type="button"
											className="p-btn rounded-xl px-3 py-2 transition hover:opacity-90"
											onClick={() =>
												planner.updateHabit(h.id, { checked: !h.checked })
											}
											aria-label="toggle"
											title="toggle"
										>
											<IconCheck checked={h.checked} />
										</button>
									</div>

									<div className="flex flex-wrap items-center gap-2">
										<div className="w-24">
											<Input
												type="number"
												value={h.priority}
												onChange={(e) =>
													planner.updateHabit(h.id, {
														priority: Number(e.target.value || 999),
													})
												}
												placeholder="Priority"
											/>
										</div>

										<div className="flex gap-2">
											<button
												type="button"
												className="p-btn rounded-xl px-3 py-2 transition hover:opacity-90"
												onClick={() => planner.moveHabit?.(h.id, "up")}
												aria-label="move up"
											>
												↑
											</button>
											<button
												type="button"
												className="p-btn rounded-xl px-3 py-2 transition hover:opacity-90"
												onClick={() => planner.moveHabit?.(h.id, "down")}
												aria-label="move down"
											>
												↓
											</button>
										</div>

										<button
											type="button"
											className="p-btn rounded-xl px-3 py-2 transition hover:opacity-90"
											onClick={() => planner.removeHabit(h.id)}
											aria-label="delete"
										>
											🗑️
										</button>
									</div>
								</div>
							)}
						</div>
					);
				})}
			</div>

			{edit ? (
				<div className="mt-3 flex flex-wrap gap-2">
					<button
						type="button"
						className="p-btn rounded-xl px-3 py-2 text-sm transition hover:opacity-90"
						onClick={() => planner.sortHabitsByPriority?.()}
					>
						Sort by priority
					</button>
				</div>
			) : null}
		</AccordionSection>
	);
}
