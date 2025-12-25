"use client";

import AccordionSection from "../AccordionSection";
import { Input } from "../ui";
import { usePlanner } from "app/lib/store";
import type { RowItem } from "app/lib/types";

type Planner = ReturnType<typeof usePlanner>;

function toNumber(v: string) {
	const n = Number(String(v ?? "").replace(/[^\d.-]/g, ""));
	return Number.isFinite(n) ? n : 0;
}

function costsTotal(rows: RowItem[]) {
	return rows.reduce((sum, r) => sum + toNumber(r.value), 0);
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

function DesktopTable({
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
		<div className="hidden md:block">
			<div className="mt-3 flex flex-wrap gap-2">
				<button
					className="p-btn-primary rounded-xl px-3 py-2 text-sm hover:opacity-90"
					onClick={onAdd}
					type="button"
				>
					+ Add row
				</button>
				<button
					className="p-btn rounded-xl px-3 py-2 text-sm hover:opacity-90"
					onClick={onSortPriority}
					type="button"
				>
					Sort by priority
				</button>
			</div>

			<div className="mt-3 overflow-x-auto rounded-2xl border bg-white">
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
									<PriorityInput
										value={r.priority}
										onChange={(n) => onUpdate(r.id, { priority: n })}
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
											className="p-btn rounded-xl px-3 py-2 hover:opacity-90"
											onClick={() => onMove(r.id, "up")}
											type="button"
										>
											↑
										</button>
										<button
											className="p-btn rounded-xl px-3 py-2 hover:opacity-90"
											onClick={() => onMove(r.id, "down")}
											type="button"
										>
											↓
										</button>
									</div>
								</td>
								<td className="p-2">
									<button
										className="p-btn rounded-xl px-3 py-2 hover:opacity-90"
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

function MobileCards({
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
		<div className="md:hidden">
			<div className="mt-3 flex flex-wrap gap-2">
				<button
					className="p-btn-primary rounded-xl px-4 py-3 text-sm hover:opacity-90"
					onClick={onAdd}
					type="button"
				>
					+ Add row
				</button>
				<button
					className="p-btn rounded-xl px-4 py-3 text-sm hover:opacity-90"
					onClick={onSortPriority}
					type="button"
				>
					Sort
				</button>
			</div>

			<div className="mt-3 space-y-3">
				{rows.length === 0 ? (
					<div
						className="p-card rounded-2xl p-4 text-sm"
						style={{ color: "var(--p-muted)" }}
					>
						No rows yet.
					</div>
				) : null}

				{rows.map((r) => (
					<div key={r.id} className="p-card rounded-2xl p-4">
						<div className="grid grid-cols-2 gap-3">
							<div>
								<div
									className="text-xs font-semibold"
									style={{ color: "var(--p-muted)" }}
								>
									Priority
								</div>
								<div className="mt-1">
									<PriorityInput
										value={r.priority}
										onChange={(n) => onUpdate(r.id, { priority: n })}
									/>
								</div>
							</div>

							<div>
								<div
									className="text-xs font-semibold"
									style={{ color: "var(--p-muted)" }}
								>
									Amount
								</div>
								<div className="mt-1">
									<Input
										value={r.value}
										onChange={(e) => onUpdate(r.id, { value: e.target.value })}
										placeholder="0"
									/>
								</div>
							</div>

							<div className="col-span-2">
								<div
									className="text-xs font-semibold"
									style={{ color: "var(--p-muted)" }}
								>
									Title
								</div>
								<div className="mt-1">
									<Input
										value={r.title}
										onChange={(e) => onUpdate(r.id, { title: e.target.value })}
										placeholder="Taxi, coffee..."
									/>
								</div>
							</div>
						</div>

						<div className="mt-3 flex gap-2">
							<button
								className="p-btn rounded-xl px-4 py-3 text-sm flex-1 hover:opacity-90"
								onClick={() => onMove(r.id, "up")}
								type="button"
							>
								↑ Up
							</button>
							<button
								className="p-btn rounded-xl px-4 py-3 text-sm flex-1 hover:opacity-90"
								onClick={() => onMove(r.id, "down")}
								type="button"
							>
								↓ Down
							</button>
							<button
								className="p-btn rounded-xl px-4 py-3 text-sm hover:opacity-90"
								onClick={() => onRemove(r.id)}
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
		</div>
	);
}

export default function CostsSection({ planner }: { planner: Planner }) {
	const total = costsTotal(planner.day.costs);

	return (
		<AccordionSection
			title="COSTS"
			subtitle={`Title + amount (multiple rows) • Total: ${total}`}
			defaultOpen={false}
		>
			<MobileCards
				rows={planner.day.costs}
				onAdd={() => planner.addCostRow()}
				onUpdate={(id, patch) => planner.updateCostRow(id, patch)}
				onRemove={(id) => planner.removeCostRow(id)}
				onMove={(id, dir) => planner.moveCostRow(id, dir)}
				onSortPriority={() => planner.sortCostsByPriority()}
			/>

			<DesktopTable
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
