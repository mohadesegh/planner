"use client";

import PlannerShell from "app/components/PlannerShell";
import DailyPlanner from "app/components/DailyPlanner";

export default function Page() {
	return (
		<PlannerShell>
			<DailyPlanner />
		</PlannerShell>
	);
}
