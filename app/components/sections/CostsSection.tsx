"use client";

import AccordionSection from "../AccordionSection";
import { Input } from "../ui";
import { usePlanner } from "app/lib/store";
import type { RowItem } from "app/lib/types";

type Planner = ReturnType<typeof usePlanner>;

function RowTable({
	rows,
	onAdd,
	onUpdate,
	onRemove,
	onMove,
	onSortPriority,
}: {
	rows: RowItem[];
	onAdd: () => void;
	onUpdate: (id: string, patch: Partial<RowItem>) => void;
	onRemove: (id: string) => void;
	onMove: (id: string, dir: "up" | "down") => void;
	onSortPriority: () => void;
}) {
	return (
		<div className="space-y-2">
			<div className="flex flex-wrap gap-2">
				<button
					className="rounded-xl border bg-black px-3 py-2 text-sm text-white"
					onClick={onAdd}
					type="button"
				>
					+ Add row
				</button>
				<button
					className="rounded-xl border bg-white px-3 py-2 text-sm text-gray-800"
					onClick={onSortPriority}
					type="button"
				>
					Sort by priority
				</button>
			</div>

			<div className="overflow-x-auto rounded-2xl border bg-white">
				<table className="w-full text-sm">
					<thead className="bg-gray-50">
						<tr className="text-left">
							<th className="p-2 w-20">Priority</th>
							<th className="p-2">Title</th>
							<th className="p-2">Amount</th>
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
										placeholder="Amount..."
									/>
								</td>
								<td className="p-2">
									<div className="flex gap-2">
										<button
											className="rounded-xl border bg-white px-3 py-2"
											onClick={() => onMove(r.id, "up")}
											type="button"
										>
											↑
										</button>
										<button
											className="rounded-xl border bg-white px-3 py-2"
											onClick={() => onMove(r.id, "down")}
											type="button"
										>
											↓
										</button>
									</div>
								</td>
								<td className="p-2">
									<button
										className="rounded-xl border bg-white px-3 py-2"
										onClick={() => onRemove(r.id)}
										type="button"
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

export default function CostsSection({ planner }: { planner: Planner }) {
	return (
		<AccordionSection
			title="COSTS"
			subtitle="Title + amount (multiple rows)"
			defaultOpen={false}
		>
			<RowTable
				rows={planner.day.costs}
				onAdd={() => planner.addCostRow()}
				onUpdate={(id, patch) => planner.updateCostRow(id, patch)}
				onRemove={(id) => planner.removeCostRow(id)}
				onMove={(id, dir) => planner.moveCostRow(id, dir)}
				onSortPriority={() => planner.sortCostsByPriority()}
			/>
		</AccordionSection>
	);
}
