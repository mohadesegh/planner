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
						className="rounded-xl border bg-black px-3 py-2 text-sm text-white"
						onClick={(e) => {
							e.stopPropagation();
							planner.addTodo("");
						}}
					>
						+ Add task
					</button>
					<button
						type="button"
						className="rounded-xl border bg-white px-3 py-2 text-sm text-gray-800"
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
					<div className="rounded-xl border bg-white p-4 text-sm text-gray-600">
						No tasks yet.
					</div>
				) : null}

				{planner.day.todos.map((t) => (
					<div
						key={t.id}
						className="flex flex-wrap items-center gap-2 rounded-2xl border bg-white p-2"
					>
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
								type="button"
								className="rounded-xl border bg-white px-3 py-2"
								onClick={() => planner.moveTodo(t.id, "up")}
							>
								↑
							</button>
							<button
								type="button"
								className="rounded-xl border bg-white px-3 py-2"
								onClick={() => planner.moveTodo(t.id, "down")}
							>
								↓
							</button>
						</div>

						<button
							type="button"
							onClick={() => planner.removeTodo(t.id)}
							className="rounded-xl border bg-white px-3 py-2 text-sm text-gray-800"
						>
							🗑️
						</button>
					</div>
				))}

				<div className="pt-2 text-xs text-gray-500">
					Tip: click <b>Save</b> to ensure it shows in Overview.
				</div>
			</div>
		</AccordionSection>
	);
}
