export type MealKey = "breakfast" | "lunch" | "snack" | "dinner";

export type RowItem = {
	id: string;
	title: string;
	value: string; // amount or calories as string
	done?: boolean;
	priority: number; // lower = higher priority
};

export type TodoItem = {
	id: string;
	text: string;
	done: boolean;
	priority: number;
};

export type HabitItem = {
	id: string;
	title: string;
	checked: boolean;
	priority: number;
};

export type MoodKey = "veryBad" | "bad" | "ok" | "good" | "great";

export type DailyData = {
	dateKey: string;
	waterCups: boolean[];

	meals: Record<MealKey, RowItem[]>;
	costs: RowItem[];
	habits: HabitItem[];

	// NEW
	sleepHours: number | null; // 0..24
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
