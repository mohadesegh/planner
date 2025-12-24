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
						className="flex items-center gap-2 rounded-xl border bg-white px-3 py-2 text-sm text-gray-800"
					>
						<span className="text-lg">💧</span>
						<IconCheck checked={v} />
					</button>
				))}
			</div>
		</AccordionSection>
	);
}
