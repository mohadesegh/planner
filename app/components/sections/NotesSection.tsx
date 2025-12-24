"use client";

import AccordionSection from "../AccordionSection";
import { Label, TextArea } from "../ui";
import { usePlanner } from "app/lib/store";

type Planner = ReturnType<typeof usePlanner>;

export default function NotesSection({ planner }: { planner: Planner }) {
	return (
		<AccordionSection
			title="NOTES"
			subtitle="Daily writing fields"
			defaultOpen={false}
		>
			<div className="grid gap-4 lg:grid-cols-2">
				<div className="space-y-4">
					<div className="rounded-2xl border bg-white p-4">
						<Label>Sentence of the day</Label>
						<TextArea
							rows={4}
							value={planner.day.sentenceOfDay}
							onChange={(e) =>
								planner.setField("sentenceOfDay", e.target.value)
							}
							className="mt-2"
						/>
					</div>

					<div className="rounded-2xl border bg-white p-4">
						<Label>Gratitude</Label>
						<TextArea
							rows={4}
							value={planner.day.gratitude}
							onChange={(e) => planner.setField("gratitude", e.target.value)}
							className="mt-2"
						/>
					</div>
				</div>

				<div className="space-y-4">
					<div className="rounded-2xl border bg-white p-4">
						<Label>Daily cleaning</Label>
						<TextArea
							rows={4}
							value={planner.day.dailyCleaning}
							onChange={(e) =>
								planner.setField("dailyCleaning", e.target.value)
							}
							className="mt-2"
						/>
					</div>

					<div className="rounded-2xl border bg-white p-4">
						<Label>Note</Label>
						<TextArea
							rows={5}
							value={planner.day.note}
							onChange={(e) => planner.setField("note", e.target.value)}
							className="mt-2"
						/>
					</div>
				</div>
			</div>
		</AccordionSection>
	);
}
