// app/components/sections/NotesSection.tsx
"use client";

import AccordionSection from "../AccordionSection";
import { IconCheck, Input, Label, TextArea } from "../ui";
import { usePlanner } from "app/lib/store";

type Planner = ReturnType<typeof usePlanner>;

function NoteCard({
	title,
	value,
	onChange,
	rows,
}: {
	title: string;
	value: string;
	onChange: (v: string) => void;
	rows: number;
}) {
	return (
		<div className="p-card rounded-2xl p-4">
			<Label>{title}</Label>
			<TextArea
				rows={rows}
				value={value}
				onChange={(e) => onChange(e.target.value)}
				className="mt-2"
			/>
		</div>
	);
}

function PriorityInput({
	value,
	onChange,
}: {
	value: number;
	onChange: (n: number) => void;
}) {
	return (
		<Input
			type="number"
			value={String(value)}
			onChange={(e) => {
				const v = e.target.value;
				if (v === "") return;
				const n = Number(v);
				if (Number.isFinite(n)) onChange(n);
			}}
			onBlur={(e) => {
				if (e.target.value.trim() === "") onChange(10);
			}}
		/>
	);
}

export default function NotesSection({ planner }: { planner: Planner }) {
	const cleaningItems = planner.day.cleaningItems ?? [];
	const cleaningDone = cleaningItems.filter((c) => c.done).length;
	const cleaningTotal = cleaningItems.length;

	return (
		<AccordionSection
			title="NOTES"
			subtitle="Daily writing fields"
			defaultOpen={false}
		>
			<div className="grid gap-4 lg:grid-cols-2">
				{/* Left column */}
				<div className="space-y-4">
					<NoteCard
						title="Sentence of the day"
						value={planner.day.sentenceOfDay}
						onChange={(v) => planner.setField("sentenceOfDay", v)}
						rows={4}
					/>

					<NoteCard
						title="Gratitude"
						value={planner.day.gratitude}
						onChange={(v) => planner.setField("gratitude", v)}
						rows={4}
					/>
				</div>

				{/* Right column */}
				<div className="space-y-4">
					{/* Daily cleaning checklist */}
					<div className="p-card rounded-2xl p-4">
						<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
							<div>
								<Label>Daily cleaning</Label>
								<div
									className="mt-1 text-xs"
									style={{ color: "var(--p-muted)" }}
								>
									{cleaningDone}/{cleaningTotal} done
								</div>
							</div>

							<div className="flex flex-wrap gap-2">
								<button
									type="button"
									className="p-btn-primary rounded-xl px-4 py-3 text-sm hover:opacity-90"
									onClick={() => planner.addCleaningItem()}
								>
									+ Add item
								</button>

								<button
									type="button"
									className="p-btn rounded-xl px-4 py-3 text-sm hover:opacity-90"
									onClick={() => planner.sortCleaningByPriority()}
								>
									Sort
								</button>
							</div>
						</div>

						{/* ✅ MOBILE: EXACT SAME STRUCTURE AS COSTS ITEM */}
						<div className="mt-3 space-y-3 md:hidden">
							{cleaningItems.length === 0 ? (
								<div
									className="p-card rounded-2xl p-4 text-sm"
									style={{ color: "var(--p-muted)" }}
								>
									No cleaning items yet.
								</div>
							) : null}

							{cleaningItems.map((c) => (
								<div key={c.id} className="p-card rounded-2xl p-4">
									{/* Row 1: Priority + Done (same as Costs: Priority + Amount) */}
									<div className="grid grid-cols-2 gap-4">
										<div>
											<div
												className="text-xs font-semibold"
												style={{ color: "var(--p-muted)" }}
											>
												Priority
											</div>
											<div className="mt-2">
												<PriorityInput
													value={c.priority}
													onChange={(n) =>
														planner.updateCleaningItem(c.id, { priority: n })
													}
												/>
											</div>
										</div>

										<div>
											<div
												className="text-xs font-semibold"
												style={{ color: "var(--p-muted)" }}
											>
												Done
											</div>
											<div className="mt-2">
												<button
													type="button"
													className="p-btn w-full rounded-xl px-4 py-3 text-sm hover:opacity-90 flex items-center justify-center gap-2"
													onClick={() =>
														planner.updateCleaningItem(c.id, { done: !c.done })
													}
												>
													<IconCheck checked={c.done} />
													{c.done ? "Done" : "Not done"}
												</button>
											</div>
										</div>

										{/* Row 2: Title full width (same as Costs: Title full width) */}
										<div className="col-span-2">
											<div
												className="text-xs font-semibold"
												style={{ color: "var(--p-muted)" }}
											>
												Task
											</div>
											<div className="mt-2">
												<Input
													value={c.text}
													onChange={(e) =>
														planner.updateCleaningItem(c.id, {
															text: e.target.value,
														})
													}
													placeholder="Cleaning task..."
													className={c.done ? "line-through opacity-70" : ""}
												/>
											</div>
										</div>
									</div>

									{/* Row 3: Order controls (same as our fixed mobile order) */}
									<div className="mt-4 grid grid-cols-[1fr_1fr_56px] gap-3">
										<button
											className="p-btn rounded-xl px-4 py-3 text-sm hover:opacity-90"
											onClick={() => planner.moveCleaningItem(c.id, "up")}
											type="button"
										>
											↑ Up
										</button>

										<button
											className="p-btn rounded-xl px-4 py-3 text-sm hover:opacity-90"
											onClick={() => planner.moveCleaningItem(c.id, "down")}
											type="button"
										>
											↓ Down
										</button>

										<button
											className="p-btn rounded-xl py-3 text-sm hover:opacity-90"
											onClick={() => planner.removeCleaningItem(c.id)}
											type="button"
											aria-label="delete"
											title="delete"
										>
											🗑️
										</button>
									</div>
								</div>
							))}
						</div>

						{/* DESKTOP: compact row layout */}
						<div className="mt-3 hidden md:block space-y-2">
							{cleaningItems.length === 0 ? (
								<div
									className="p-chip rounded-2xl p-3 text-sm"
									style={{ color: "var(--p-muted)" }}
								>
									No cleaning items yet.
								</div>
							) : null}

							{cleaningItems.map((c) => (
								<div key={c.id} className="p-chip rounded-2xl p-2">
									<div className="flex flex-wrap items-center gap-2">
										<button
											type="button"
											className="shrink-0"
											onClick={() =>
												planner.updateCleaningItem(c.id, { done: !c.done })
											}
											aria-label="toggle cleaning item"
										>
											<IconCheck checked={c.done} />
										</button>

										<div className="w-24">
											<PriorityInput
												value={c.priority}
												onChange={(n) =>
													planner.updateCleaningItem(c.id, { priority: n })
												}
											/>
										</div>

										<div className="flex-1 min-w-[220px]">
											<Input
												value={c.text}
												onChange={(e) =>
													planner.updateCleaningItem(c.id, {
														text: e.target.value,
													})
												}
												placeholder="Cleaning task..."
												className={c.done ? "line-through opacity-70" : ""}
											/>
										</div>

										<div className="flex gap-2">
											<button
												type="button"
												className="p-btn rounded-xl px-3 py-2 hover:opacity-90"
												onClick={() => planner.moveCleaningItem(c.id, "up")}
											>
												↑
											</button>
											<button
												type="button"
												className="p-btn rounded-xl px-3 py-2 hover:opacity-90"
												onClick={() => planner.moveCleaningItem(c.id, "down")}
											>
												↓
											</button>
										</div>

										<button
											type="button"
											className="p-btn rounded-xl px-3 py-2 hover:opacity-90"
											onClick={() => planner.removeCleaningItem(c.id)}
										>
											🗑️
										</button>
									</div>
								</div>
							))}
						</div>
					</div>

					<NoteCard
						title="Note"
						value={planner.day.note}
						onChange={(v) => planner.setField("note", v)}
						rows={5}
					/>
				</div>
			</div>
		</AccordionSection>
	);
}
