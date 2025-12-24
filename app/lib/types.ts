export type MealKey = "breakfast" | "lunch" | "snack" | "dinner";

/* ---------- GENERIC ROW ---------- */
export type RowItem = {
	id: string;
	title: string;
	value: string;
	priority: number;
};

/* ---------- TODO ---------- */
export type TodoItem = {
	id: string;
	text: string;
	done: boolean;
	priority: number;
};

/* ---------- HABIT ---------- */
export type HabitItem = {
	id: string;
	title: string;
	checked: boolean;
	priority: number;
};

/* ---------- SLEEP ---------- */
export type SleepPause = {
	id: string;
	start: string; // HH:mm
	end: string; // HH:mm
};

export type SleepData = {
	start: string | null;
	end: string | null;
	pauses: SleepPause[];
};

/* ---------- MOOD (8) ---------- */
export type MoodKey =
	| "awful"
	| "veryBad"
	| "bad"
	| "meh"
	| "ok"
	| "good"
	| "veryGood"
	| "amazing";

/* ---------- DAILY ---------- */
export type DailyData = {
	dateKey: string;

	waterCups: boolean[];

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
