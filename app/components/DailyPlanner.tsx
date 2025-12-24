"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
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
import { Card, IconCheck, Input, Label, TextArea } from "./ui";
import type { MealKey, MoodKey, RowItem } from "app/lib/types";

const MEALS: { key: MealKey; title: string; subtitle: string }[] = [
	{ key: "dinner", title: "Dinner", subtitle: "شام" },
	{ key: "snack", title: "Snack", subtitle: "میان وعده" },
	{ key: "lunch", title: "Lunch", subtitle: "نهار" },
	{ key: "breakfast", title: "Breakfast", subtitle: "صبحانه" },
];

const MOODS: { key: MoodKey; label: string; emoji: string }[] = [
	{ key: "veryBad", label: "خیلی بد", emoji: "😞" },
	{ key: "bad", label: "بد", emoji: "🙁" },
	{ key: "ok", label: "معمولی", emoji: "😐" },
	{ key: "good", label: "خوب", emoji: "🙂" },
	{ key: "great", label: "عالی", emoji: "😄" },
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
					className="rounded-xl border bg-black px-3 py-2 text-sm text-white"
					onClick={onAdd}
				>
					+ Add row
				</button>
				<button
					className="rounded-xl border bg-white px-3 py-2 text-sm text-gray-800"
					onClick={onSortPriority}
				>
					Sort by priority
				</button>
			</div>

			<div className="overflow-x-auto rounded-2xl border bg-white">
				<table className="w-full text-sm">
					<thead className="bg-gray-50">
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
								<td className="p-3 text-gray-500" colSpan={5}>
									No rows yet.
								</td>
							</tr>
						)}
						{rows.map((r) => (
							<tr key={r.id} className="border-t">
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
										placeholder="Amount / Calories..."
									/>
								</td>
								<td className="p-2">
									<div className="flex gap-2">
										<button
											className="rounded-xl border bg-white px-3 py-2"
											onClick={() => onMove(r.id, "up")}
										>
											↑
										</button>
										<button
											className="rounded-xl border bg-white px-3 py-2"
											onClick={() => onMove(r.id, "down")}
										>
											↓
										</button>
									</div>
								</td>
								<td className="p-2">
									<button
										className="rounded-xl border bg-white px-3 py-2"
										onClick={() => onRemove(r.id)}
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

export default function DailyPlanner() {
	const sp = useSearchParams();
	const [selected, setSelected] = useState<string>(toDateKey(new Date()));
	const planner = usePlanner(selected);

	useEffect(() => {
		const k = sp.get("date");
		if (k) setSelected(k);
	}, [sp]);

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
						<div className="text-xs font-semibold tracking-widest text-gray-600">
							برنامه امروز
						</div>
						<div className="text-lg font-bold text-gray-900">
							{formatPersianPretty(dateObj)}
						</div>
						<div className="mt-1 text-xs text-gray-600">
							{savedLabel}
							{savedTime ? ` • ${savedTime}` : ""}
						</div>
					</div>

					<div className="flex flex-wrap items-center gap-2">
						<button
							className="rounded-xl border bg-white px-3 py-2 text-sm text-gray-800"
							onClick={() => setSelected(toDateKey(addDays(dateObj, -1)))}
						>
							← روز قبل
						</button>
						<button
							className="rounded-xl border bg-white px-3 py-2 text-sm text-gray-800"
							onClick={() => setSelected(toDateKey(new Date()))}
						>
							امروز
						</button>
						<button
							className="rounded-xl border bg-white px-3 py-2 text-sm text-gray-800"
							onClick={() => setSelected(toDateKey(addDays(dateObj, 1)))}
						>
							روز بعد →
						</button>

						<button
							className={
								"rounded-xl border px-3 py-2 text-sm " +
								(planner.isDirty
									? "bg-black text-white"
									: "bg-gray-100 text-gray-700")
							}
							onClick={() => planner.saveNow()}
							disabled={!planner.isDirty}
						>
							ذخیره
						</button>

						<Link
							href="/overview"
							className="rounded-xl border bg-white px-3 py-2 text-sm text-gray-800"
						>
							نمای کلی →
						</Link>
					</div>
				</div>

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
									"rounded-full border px-3 py-1 text-sm " +
									(active ? "bg-black text-white" : "bg-white text-gray-800")
								}
								title={k}
							>
								{label}
							</button>
						);
					})}
				</div>
			</Card>

			{/* MAIN GRID: on mobile/tablet Task list should be TOP */}
			<div className="grid gap-4 lg:grid-cols-3">
				{/* ✅ TASK LIST first on mobile/tablet */}
				<Card className="lg:col-span-2 order-1 lg:order-2">
					<div className="flex flex-wrap items-center justify-between gap-2">
						<div>
							<div className="text-xs font-semibold tracking-widest text-gray-600">
								TO DO LIST
							</div>
							<div className="text-sm text-gray-600">
								لیست کارها (با اولویت)
							</div>
						</div>

						<div className="flex gap-2">
							<button
								className="rounded-xl border bg-black px-3 py-2 text-sm text-white"
								onClick={() => planner.addTodo("")}
							>
								+ Add task
							</button>
							<button
								className="rounded-xl border bg-white px-3 py-2 text-sm text-gray-800"
								onClick={() => planner.sortTodosByPriority()}
							>
								Sort by priority
							</button>
						</div>
					</div>

					<div className="mt-4 space-y-2">
						{planner.day.todos.length === 0 && (
							<div className="rounded-xl border bg-white p-4 text-sm text-gray-600">
								هیچ کاری اضافه نشده.
							</div>
						)}

						{planner.day.todos.map((t) => (
							<div
								key={t.id}
								className="flex flex-wrap items-center gap-2 rounded-2xl border bg-white p-2"
							>
								<button
									className="shrink-0"
									onClick={() => planner.updateTodo(t.id, { done: !t.done })}
								>
									<IconCheck checked={t.done} />
								</button>

								<div className="w-24">
									<Input
										type="number"
										value={t.priority}
										onChange={(e) =>
											planner.updateTodo(t.id, {
												priority: Number(e.target.value || 999),
											})
										}
									/>
								</div>

								<div className="flex-1 min-w-[220px]">
									<Input
										value={t.text}
										onChange={(e) =>
											planner.updateTodo(t.id, { text: e.target.value })
										}
										placeholder="Write a task..."
										className={t.done ? "line-through opacity-70" : ""}
									/>
								</div>

								<div className="flex gap-2">
									<button
										className="rounded-xl border bg-white px-3 py-2"
										onClick={() => planner.moveTodo(t.id, "up")}
									>
										↑
									</button>
									<button
										className="rounded-xl border bg-white px-3 py-2"
										onClick={() => planner.moveTodo(t.id, "down")}
									>
										↓
									</button>
								</div>

								<button
									onClick={() => planner.removeTodo(t.id)}
									className="rounded-xl border bg-white px-3 py-2 text-sm text-gray-800"
								>
									🗑️
								</button>
							</div>
						))}
					</div>
				</Card>

				{/* Right column on desktop, below on mobile: Sleep + Mood */}
				<Card className="order-2 lg:order-1">
					<div className="flex items-baseline justify-between">
						<div>
							<div className="text-xs font-semibold tracking-widest text-gray-600">
								SLEEP / MOOD
							</div>
							<div className="text-sm text-gray-600">خواب و حال روحی</div>
						</div>
						<div className="text-xl">🌙</div>
					</div>

					{/* Sleep */}
					<div className="mt-4">
						<Label>Sleep hours (ساعت خواب)</Label>
						<div className="mt-2 flex items-center gap-2">
							<Input
								type="number"
								min={0}
								max={24}
								step={0.5}
								value={planner.day.sleepHours ?? ""}
								onChange={(e) => {
									const v = e.target.value;
									planner.setSleepHours(v === "" ? null : Number(v));
								}}
								placeholder="مثلا 7.5"
							/>
							<div className="text-sm text-gray-600">hours</div>
						</div>
					</div>

					{/* Mood */}
					<div className="mt-5">
						<Label>Mood (حال)</Label>
						<div className="mt-2 grid grid-cols-5 gap-2">
							{MOODS.map((m) => {
								const active = planner.day.mood === m.key;
								return (
									<button
										key={m.key}
										className={
											"rounded-xl border px-2 py-2 text-sm " +
											(active
												? "bg-black text-white"
												: "bg-white text-gray-800")
										}
										onClick={() => planner.setMood(active ? null : m.key)}
										title={m.label}
									>
										<div className="text-lg">{m.emoji}</div>
									</button>
								);
							})}
						</div>
						<div className="mt-2 text-xs text-gray-600">
							Selected:{" "}
							{planner.day.mood
								? MOODS.find((x) => x.key === planner.day.mood)?.label
								: "—"}
						</div>
					</div>
				</Card>
			</div>

			{/* Water + Meals + Habits + Costs */}
			<div className="grid gap-4 lg:grid-cols-3">
				<Card className="lg:col-span-2">
					<div className="flex items-end justify-between gap-3">
						<div>
							<div className="text-xs font-semibold tracking-widest text-gray-600">
								WATER CHECK LIST
							</div>
							<div className="text-sm text-gray-600">چک لیست نوشیدن آب</div>
						</div>
						<div className="text-xs text-gray-500">8 cups</div>
					</div>

					<div className="mt-3 flex flex-wrap gap-2">
						{planner.day.waterCups.map((v, idx) => (
							<button
								key={idx}
								onClick={() => planner.setWater(idx, !v)}
								className="flex items-center gap-2 rounded-xl border bg-white px-3 py-2 text-sm text-gray-800"
							>
								<span className="text-lg">💧</span>
								<IconCheck checked={v} />
							</button>
						))}
					</div>

					{/* Meals */}
					<div className="mt-6">
						<div className="text-xs font-semibold tracking-widest text-gray-600">
							MEAL PLAN
						</div>
						<div className="text-sm text-gray-600">
							برنامه غذایی (عنوان + کالری)
						</div>

						<div className="mt-3 grid gap-4">
							{MEALS.map((m) => (
								<div key={m.key} className="rounded-2xl border bg-white p-3">
									<div className="flex flex-wrap items-baseline justify-between gap-2">
										<div className="font-semibold text-gray-900">
											{m.title}{" "}
											<span className="text-xs text-gray-500">
												({m.subtitle})
											</span>
										</div>
										<div className="text-xs text-gray-500">
											Rows: {planner.day.meals[m.key].length}
										</div>
									</div>

									<RowTable
										rows={planner.day.meals[m.key]}
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
							))}
						</div>
					</div>

					{/* Habits */}
					<div className="mt-6">
						<div className="flex flex-wrap items-center justify-between gap-2">
							<div>
								<div className="text-xs font-semibold tracking-widest text-gray-600">
									HABITS
								</div>
								<div className="text-sm text-gray-600">
									عادت‌ها (قابل افزودن)
								</div>
							</div>
							<div className="flex gap-2">
								<button
									className="rounded-xl border bg-black px-3 py-2 text-sm text-white"
									onClick={() => planner.addHabit("")}
								>
									+ افزودن عادت
								</button>
								<button
									className="rounded-xl border bg-white px-3 py-2 text-sm text-gray-800"
									onClick={() => planner.sortHabitsByPriority()}
								>
									Sort by priority
								</button>
							</div>
						</div>

						<div className="mt-3 space-y-2">
							{planner.day.habits.length === 0 && (
								<div className="rounded-xl border bg-white p-3 text-sm text-gray-500">
									هیچ عادتی اضافه نشده.
								</div>
							)}

							{planner.day.habits.map((h) => (
								<div
									key={h.id}
									className="flex flex-wrap items-center gap-2 rounded-2xl border bg-white p-2"
								>
									<button
										onClick={() =>
											planner.updateHabit(h.id, { checked: !h.checked })
										}
										className="shrink-0"
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
											className="rounded-xl border bg-white px-3 py-2"
											onClick={() => planner.moveHabit(h.id, "up")}
										>
											↑
										</button>
										<button
											className="rounded-xl border bg-white px-3 py-2"
											onClick={() => planner.moveHabit(h.id, "down")}
										>
											↓
										</button>
									</div>

									<button
										className="rounded-xl border bg-white px-3 py-2"
										onClick={() => planner.removeHabit(h.id)}
									>
										🗑️
									</button>
								</div>
							))}
						</div>
					</div>
				</Card>

				{/* Costs */}
				<Card>
					<div className="flex items-baseline justify-between">
						<div>
							<div className="text-xs font-semibold tracking-widest text-gray-600">
								COSTS
							</div>
							<div className="text-sm text-gray-600">
								هزینه‌ها (عنوان + مبلغ)
							</div>
						</div>
						<div className="text-xl">👛</div>
					</div>

					<RowTable
						rows={planner.day.costs}
						col1="Title"
						col2="Amount"
						onAdd={() => planner.addCostRow()}
						onUpdate={(id, patch) => planner.updateCostRow(id, patch)}
						onRemove={(id) => planner.removeCostRow(id)}
						onMove={(id, dir) => planner.moveCostRow(id, dir)}
						onSortPriority={() => planner.sortCostsByPriority()}
					/>
				</Card>
			</div>

			{/* Notes */}
			<div className="grid gap-4 lg:grid-cols-3">
				<div className="space-y-4">
					<Card>
						<Label>Sentence Of The Day (جمله روز)</Label>
						<TextArea
							rows={4}
							value={planner.day.sentenceOfDay}
							onChange={(e) =>
								planner.setField("sentenceOfDay", e.target.value)
							}
							className="mt-2"
						/>
					</Card>
					<Card>
						<Label>Thanks Giving (شکرگزاری)</Label>
						<TextArea
							rows={4}
							value={planner.day.gratitude}
							onChange={(e) => planner.setField("gratitude", e.target.value)}
							className="mt-2"
						/>
					</Card>
					<Card>
						<Label>Daily Cleaning (نظافت روزانه)</Label>
						<TextArea
							rows={4}
							value={planner.day.dailyCleaning}
							onChange={(e) =>
								planner.setField("dailyCleaning", e.target.value)
							}
							className="mt-2"
						/>
					</Card>
					<Card>
						<Label>NOTE (یادداشت)</Label>
						<TextArea
							rows={5}
							value={planner.day.note}
							onChange={(e) => planner.setField("note", e.target.value)}
							className="mt-2"
						/>
					</Card>
				</div>

				<Card className="lg:col-span-2">
					<div className="text-xs text-gray-500">
						برای اینکه در نمای کلی نمایش داده شود، دکمه <b>ذخیره</b> را بزنید.
					</div>
				</Card>
			</div>
		</div>
	);
}
