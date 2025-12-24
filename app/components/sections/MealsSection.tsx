"use client";

import AccordionSection from "../AccordionSection";
import { Input } from "../ui";
import { usePlanner } from "app/lib/store";
import type { MealKey, RowItem } from "app/lib/types";

type Planner = ReturnType<typeof usePlanner>;

const MEALS: { key: MealKey; title: string }[] = [
	{ key: "breakfast", title: "Breakfast" },
	{ key: "lunch", title: "Lunch" },
	{ key: "snack", title: "Snack" },
	{ key: "dinner", title: "Dinner" },
];

function RowTable({
	rows,
	col1,
	col2,
	onAdd,
	onUpdate,
	onRemove,
	onMove,
	onSortPriority,
}: {
	rows: RowItem[];
	col1: string;
	col2: string;
	onAdd: () => void;
	onUpdate: (id: string, patch: Partial<RowItem>) => void;
	onRemove: (id: string) => void;
	onMove: (id: string, dir: "up" | "down") => void;
	onSortPriority: () => void;
}) {
	return (
		<div className="mt-3 space-y-2">
			<div className="flex flex-wrap gap-2">
				<button
					className="p-btn-primary rounded-xl px-3 py-2 text-sm transition hover:opacity-90"
					onClick={onAdd}
					type="button"
				>
					+ Add row
				</button>
				<button
					className="p-btn rounded-xl px-3 py-2 text-sm transition hover:opacity-90"
					onClick={onSortPriority}
					type="button"
				>
					Sort by priority
				</button>
			</div>

			<div
				className="overflow-x-auto rounded-2xl border"
				style={{
					background: "rgba(252,249,234,0.85)",
					borderColor: "var(--p-border)",
				}}
			>
				<table className="w-full text-sm">
					<thead style={{ background: "rgba(186,223,219,0.45)" }}>
						<tr className="text-left">
							<th className="p-2 w-20">Priority</th>
							<th className="p-2">{col1}</th>
							<th className="p-2">{col2}</th>
							<th className="p-2 w-40">Order</th>
							<th className="p-2 w-20">Del</th>
						</tr>
					</thead>

					<tbody>
						{rows.length === 0 && (
							<tr>
								<td
									className="p-3"
									colSpan={5}
									style={{ color: "var(--p-muted)" }}
								>
									No rows yet.
								</td>
							</tr>
						)}

						{rows.map((r) => (
							<tr
								key={r.id}
								className="border-t"
								style={{ borderColor: "var(--p-border)" }}
							>
								<td className="p-2">
									<Input
										type="number"
										value={r.priority}
										onChange={(e) =>
											onUpdate(r.id, {
												priority: Number(e.target.value || 999),
											})
										}
									/>
								</td>

								<td className="p-2">
									<Input
										value={r.title}
										onChange={(e) => onUpdate(r.id, { title: e.target.value })}
										placeholder="Title..."
									/>
								</td>

								<td className="p-2">
									<Input
										value={r.value}
										onChange={(e) => onUpdate(r.id, { value: e.target.value })}
										placeholder="Calories..."
									/>
								</td>

								<td className="p-2">
									<div className="flex gap-2">
										<button
											className="p-btn rounded-xl px-3 py-2 transition hover:opacity-90"
											onClick={() => onMove(r.id, "up")}
											type="button"
											aria-label="move up"
										>
											↑
										</button>
										<button
											className="p-btn rounded-xl px-3 py-2 transition hover:opacity-90"
											onClick={() => onMove(r.id, "down")}
											type="button"
											aria-label="move down"
										>
											↓
										</button>
									</div>
								</td>

								<td className="p-2">
									<button
										className="p-btn rounded-xl px-3 py-2 transition hover:opacity-90"
										onClick={() => onRemove(r.id)}
										type="button"
										aria-label="delete"
									>
										🗑️
									</button>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
}

function mealCalories(rows: RowItem[]) {
	const toNum = (v: string) => {
		const x = Number(String(v).replace(/,/g, "").trim());
		return Number.isFinite(x) ? x : 0;
	};
	return rows.reduce((sum, r) => sum + toNum(r.value), 0);
}

export default function MealsSection({ planner }: { planner: Planner }) {
	const totalCalories =
		mealCalories(planner.day.meals.breakfast) +
		mealCalories(planner.day.meals.lunch) +
		mealCalories(planner.day.meals.snack) +
		mealCalories(planner.day.meals.dinner);

	return (
		<AccordionSection
			title="MEALS"
			subtitle={`Title + calories (multiple rows) • Total calories: ${Math.round(
				totalCalories
			)}`}
			defaultOpen={false}
		>
			<div className="grid gap-4">
				{MEALS.map((m) => {
					const rows = planner.day.meals[m.key];
					const kcal = mealCalories(rows);

					return (
						<div key={m.key} className="p-card rounded-2xl p-3">
							<div className="flex flex-wrap items-baseline justify-between gap-2">
								<div
									className="font-semibold"
									style={{ color: "var(--p-text)" }}
								>
									{m.title}
								</div>

								<div className="flex flex-wrap gap-2">
									<span className="p-chip rounded-full px-3 py-1 text-xs">
										Rows: <b>{rows.length}</b>
									</span>
									<span className="p-chip rounded-full px-3 py-1 text-xs">
										Calories: <b>{Math.round(kcal)}</b>
									</span>
								</div>
							</div>

							<RowTable
								rows={rows}
								col1="Title"
								col2="Calories"
								onAdd={() => planner.addMealRow(m.key)}
								onUpdate={(id, patch) =>
									planner.updateMealRow(m.key, id, patch)
								}
								onRemove={(id) => planner.removeMealRow(m.key, id)}
								onMove={(id, dir) => planner.moveMealRow(m.key, id, dir)}
								onSortPriority={() => planner.sortMealByPriority(m.key)}
							/>
						</div>
					);
				})}
			</div>
		</AccordionSection>
	);
}
