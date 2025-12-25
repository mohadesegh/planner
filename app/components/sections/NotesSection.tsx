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

export default function NotesSection({ planner }: { planner: Planner }) {
	const cleaningDone = (planner.day.cleaningItems ?? []).filter(
		(c) => c.done
	).length;
	const cleaningTotal = (planner.day.cleaningItems ?? []).length;

	return (
		<AccordionSection
			title="NOTES"
			subtitle="Daily writing fields"
			defaultOpen={false}
		>
			<div className="grid gap-4 lg:grid-cols-2">
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

				<div className="space-y-4">
					{/* ✅ Daily cleaning as checklist */}
					<div className="p-card rounded-2xl p-4">
						<div className="flex flex-wrap items-center justify-between gap-2">
							<div>
								<Label>Daily cleaning</Label>
								<div
									className="mt-1 text-xs"
									style={{ color: "var(--p-muted)" }}
								>
									{cleaningDone}/{cleaningTotal} done
								</div>
							</div>

							<div className="flex gap-2">
								<button
									type="button"
									className="p-btn-primary rounded-xl px-3 py-2 text-sm hover:opacity-90"
									onClick={() => planner.addCleaningItem()}
								>
									+ Add item
								</button>

								<button
									type="button"
									className="p-btn rounded-xl px-3 py-2 text-sm hover:opacity-90"
									onClick={() => planner.sortCleaningByPriority()}
								>
									Sort
								</button>
							</div>
						</div>

						<div className="mt-3 space-y-2">
							{(planner.day.cleaningItems ?? []).length === 0 ? (
								<div
									className="p-chip rounded-xl p-3 text-sm"
									style={{ color: "var(--p-muted)" }}
								>
									No cleaning items yet.
								</div>
							) : null}

							{(planner.day.cleaningItems ?? []).map((c) => (
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
											<Input
												type="number"
												value={String(c.priority)}
												onChange={(e) => {
													const v = e.target.value;
													if (v === "") return;
													const n = Number(v);
													if (Number.isFinite(n))
														planner.updateCleaningItem(c.id, { priority: n });
												}}
												onBlur={(e) => {
													if (e.target.value.trim() === "")
														planner.updateCleaningItem(c.id, { priority: 10 });
												}}
											/>
										</div>

										<div className="flex-1 min-w-[200px]">
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
