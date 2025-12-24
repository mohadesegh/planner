// app/lib/types.ts

export type MealKey = "breakfast" | "lunch" | "snack" | "dinner";

export type MoodKey =
	| "awful"
	| "veryBad"
	| "bad"
	| "meh"
	| "ok"
	| "good"
	| "veryGood"
	| "amazing";

export type RowItem = {
	id: string;
	title: string;
	value: string; // calories / amount
	priority: number;
};

export type TodoItem = {
	id: string;
	text: string;
	done: boolean;
	priority: number;
};

export type SleepPause = {
	id: string;
	start: string; // "HH:mm"
	end: string; // "HH:mm"
};

export type SleepData = {
	start: string | null; // "HH:mm"
	end: string | null; // "HH:mm"
	pauses: SleepPause[];
};

export type HabitItem = {
	id: string;
	title: string;
	checked: boolean;
	priority: number;
	icon?: string; // ✅ emoji/icon e.g. 💊
};

export type DailyData = {
	dateKey: string;

	waterCups: boolean[]; // 8

	meals: Record<MealKey, RowItem[]>;
	costs: RowItem[];
	habits: HabitItem[];

	sleep: SleepData;
	mood: MoodKey | null;

	sentenceOfDay: string;
	gratitude: string;
	dailyCleaning: string;
	note: string;

	todos: TodoItem[];
};

export type PlannerDB = {
	version: number;
	days: Record<string, DailyData>;
};
