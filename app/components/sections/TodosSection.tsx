"use client";

import AccordionSection from "../AccordionSection";
import { IconCheck, Input } from "../ui";
import { usePlanner } from "app/lib/store";

type Planner = ReturnType<typeof usePlanner>;

export default function TodosSection({ planner }: { planner: Planner }) {
	return (
		<AccordionSection
			title="TO DO LIST"
			subtitle="Prioritized tasks"
			defaultOpen={true}
			rightSlot={
				<div className="flex gap-2">
					<button
						type="button"
						className="p-btn-primary rounded-xl px-3 py-2 text-sm hover:opacity-90"
						onClick={(e) => {
							e.stopPropagation();
							planner.addTodo("");
						}}
					>
						+ Add task
					</button>
					<button
						type="button"
						className="p-btn rounded-xl px-3 py-2 text-sm hover:opacity-90"
						onClick={(e) => {
							e.stopPropagation();
							planner.sortTodosByPriority();
						}}
					>
						Sort
					</button>
				</div>
			}
		>
			<div className="space-y-2">
				{planner.day.todos.length === 0 ? (
					<div
						className="p-card rounded-xl p-4 text-sm"
						style={{ color: "var(--p-muted)" }}
					>
						No tasks yet.
					</div>
				) : null}

				{planner.day.todos.map((t) => (
					<div key={t.id} className="p-card rounded-2xl p-2">
						<div className="flex flex-wrap items-center gap-2">
							<button
								type="button"
								className="shrink-0"
								onClick={() => planner.updateTodo(t.id, { done: !t.done })}
								aria-label="toggle task"
							>
								<IconCheck checked={t.done} />
							</button>

							<div className="w-24">
								<Input
									type="number"
									value={String(t.priority)}
									onChange={(e) => {
										const v = e.target.value;
										// allow empty while typing (don't force 999)
										if (v === "") return;
										const n = Number(v);
										if (Number.isFinite(n)) {
											planner.updateTodo(t.id, { priority: n });
										}
									}}
									onBlur={(e) => {
										const v = e.target.value.trim();
										// if user leaves it empty, set a sensible default
										if (v === "") planner.updateTodo(t.id, { priority: 10 });
									}}
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
									type="button"
									className="p-btn rounded-xl px-3 py-2 hover:opacity-90"
									onClick={() => planner.moveTodo(t.id, "up")}
								>
									↑
								</button>
								<button
									type="button"
									className="p-btn rounded-xl px-3 py-2 hover:opacity-90"
									onClick={() => planner.moveTodo(t.id, "down")}
								>
									↓
								</button>
							</div>

							<button
								type="button"
								onClick={() => planner.removeTodo(t.id)}
								className="p-btn rounded-xl px-3 py-2 text-sm hover:opacity-90"
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
