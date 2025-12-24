"use client";

import AccordionSection from "../AccordionSection";
import { IconCheck } from "../ui";
import { usePlanner } from "app/lib/store";

type Planner = ReturnType<typeof usePlanner>;

export default function WaterSection({ planner }: { planner: Planner }) {
	return (
		<AccordionSection
			title="WATER CHECKLIST"
			subtitle="8 cups"
			defaultOpen={false}
		>
			<div className="flex flex-wrap gap-2">
				{planner.day.waterCups.map((v, idx) => (
					<button
						key={idx}
						type="button"
						onClick={() => planner.setWater(idx, !v)}
						className={
							"flex items-center gap-2 rounded-xl px-3 py-2 text-sm transition hover:opacity-90 " +
							(v ? "p-btn-accent" : "p-btn")
						}
						aria-label={`water cup ${idx + 1}`}
					>
						<span className="text-lg">💧</span>
						<IconCheck checked={v} />
					</button>
				))}
			</div>

			<div className="mt-3 text-xs" style={{ color: "var(--p-muted)" }}>
				Completed:{" "}
				<b style={{ color: "var(--p-text)" }}>
					{planner.day.waterCups.filter(Boolean).length}
				</b>
				/8
			</div>
		</AccordionSection>
	);
}
