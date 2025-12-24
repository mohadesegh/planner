"use client";

import AccordionSection from "../AccordionSection";
import { Label, TextArea } from "../ui";
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
					<NoteCard
						title="Daily cleaning"
						value={planner.day.dailyCleaning}
						onChange={(v) => planner.setField("dailyCleaning", v)}
						rows={4}
					/>

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
