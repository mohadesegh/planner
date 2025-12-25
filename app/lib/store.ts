// app/lib/store.ts
"use client";

import { useMemo, useState } from "react";
import type {
	DailyData,
	HabitItem,
	MealKey,
	MoodKey,
	PlannerDB,
	RowItem,
	SleepData,
	SleepPause,
	TodoItem,
} from "./types";
import { toDateKey } from "./date";

const STORAGE_KEY = "planner_db_v7";

/* ---------- defaults (match your image) ---------- */
const DEFAULT_HABITS: Array<{ title: string; icon: string; priority: number }> =
	[
		{ title: "Quit a bad habit", icon: "🚫", priority: 1 },
		{ title: "Medicine", icon: "💊", priority: 2 },
		{ title: "Study", icon: "📚", priority: 3 },
		{ title: "Sport", icon: "🏋️", priority: 4 },
		{ title: "Skin care", icon: "🧴", priority: 5 },
		{ title: "Fruit", icon: "🍎", priority: 6 },
	];

/* ---------- helpers ---------- */
const uid = () => crypto.randomUUID();

function minutes(v: string) {
	const [h, m] = v.split(":").map(Number);
	return h * 60 + m;
}

function calcSleep(s: SleepData) {
	if (!s.start || !s.end) return 0;

	const start = minutes(s.start);
	let end = minutes(s.end);
	if (end <= start) end += 1440;

	let total = end - start;

	for (const p of s.pauses) {
		if (!p.start || !p.end) continue;
		const ps = minutes(p.start);
		let pe = minutes(p.end);
		if (pe <= ps) pe += 1440;
		total -= pe - ps;
	}

	return Math.max(0, total);
}

function emptyDay(dateKey: string): DailyData {
	return {
		dateKey,
		waterCups: Array(8).fill(false),

		meals: { breakfast: [], lunch: [], snack: [], dinner: [] },
		costs: [],

		// ✅ default habits from your image
		habits: DEFAULT_HABITS.map((h) => ({
			id: uid(),
			title: h.title,
			icon: h.icon,
			checked: false,
			priority: h.priority,
		})),

		sleep: { start: null, end: null, pauses: [] },
		mood: null,

		sentenceOfDay: "",
		gratitude: "",
		dailyCleaning: "",
		note: "",
		cleaningItems: [],

		todos: [],
	};
}

function safeLoadDB(): PlannerDB {
	if (typeof window === "undefined") return { version: 7, days: {} };
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		if (!raw) return { version: 7, days: {} };
		const parsed = JSON.parse(raw) as PlannerDB;
		if (!parsed || typeof parsed !== "object") return { version: 7, days: {} };
		return parsed;
	} catch {
		return { version: 7, days: {} };
	}
}

function safeSaveDB(db: PlannerDB) {
	if (typeof window === "undefined") return;
	localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
}

function sortByPriority<T extends { priority: number }>(arr: T[]) {
	return [...arr].sort((a, b) => a.priority - b.priority);
}

/* ---------- hook ---------- */
export function usePlanner(dateKey?: string) {
	const key = dateKey ?? toDateKey(new Date());
	const [db, setDB] = useState<PlannerDB>(() => safeLoadDB());

	const [isDirty, setIsDirty] = useState(false);
	const [lastSavedAt, setLastSavedAt] = useState<number | null>(null);

	const day = useMemo(() => db.days[key] ?? emptyDay(key), [db.days, key]);

	function updateDay(fn: (d: DailyData) => DailyData) {
		setIsDirty(true);
		setDB((prev) => {
			const current = prev.days[key] ?? emptyDay(key);
			const nextDay = fn(current);
			const next = { ...prev, days: { ...prev.days, [key]: nextDay } };

			// optional UI notifier
			if (typeof window !== "undefined") {
				window.dispatchEvent(new Event("planner:changed"));
			}

			return next;
		});
	}

	function saveNow() {
		if (typeof window === "undefined") return;
		safeSaveDB(db);
		setIsDirty(false);
		setLastSavedAt(Date.now());
	}

	function getDay(k: string) {
		return db.days[k] ?? emptyDay(k);
	}
	// ---------- cleaning checklist ----------
	const addCleaningItem = () =>
		updateDay((d) => ({
			...d,
			cleaningItems: [
				{ id: uid(), text: "", done: false, priority: 10 },
				...(d.cleaningItems ?? []),
			],
		}));

	const updateCleaningItem = (
		id: string,
		patch: Partial<{ text: string; done: boolean; priority: number }>
	) =>
		updateDay((d) => ({
			...d,
			cleaningItems: (d.cleaningItems ?? []).map((c) =>
				c.id === id ? { ...c, ...patch } : c
			),
		}));

	const removeCleaningItem = (id: string) =>
		updateDay((d) => ({
			...d,
			cleaningItems: (d.cleaningItems ?? []).filter((c) => c.id !== id),
		}));

	const moveCleaningItem = (id: string, dir: "up" | "down") =>
		updateDay((d) => {
			const rows = [...(d.cleaningItems ?? [])];
			const idx = rows.findIndex((c) => c.id === id);
			if (idx < 0) return d;
			const j = dir === "up" ? idx - 1 : idx + 1;
			if (j < 0 || j >= rows.length) return d;
			const tmp = rows[idx];
			rows[idx] = rows[j];
			rows[j] = tmp;
			return { ...d, cleaningItems: rows };
		});

	const sortCleaningByPriority = () =>
		updateDay((d) => ({
			...d,
			cleaningItems: sortByPriority(d.cleaningItems ?? []),
		}));

	/* ---------- water ---------- */
	const setWater = (idx: number, val: boolean) =>
		updateDay((d) => {
			const next = [...d.waterCups];
			next[idx] = val;
			return { ...d, waterCups: next };
		});

	/* ---------- meals ---------- */
	const addMealRow = (meal: MealKey) =>
		updateDay((d) => ({
			...d,
			meals: {
				...d.meals,
				[meal]: [
					{ id: uid(), title: "", value: "", priority: 10 },
					...d.meals[meal],
				],
			},
		}));

	const updateMealRow = (meal: MealKey, id: string, patch: Partial<RowItem>) =>
		updateDay((d) => ({
			...d,
			meals: {
				...d.meals,
				[meal]: d.meals[meal].map((r) =>
					r.id === id ? { ...r, ...patch } : r
				),
			},
		}));

	const removeMealRow = (meal: MealKey, id: string) =>
		updateDay((d) => ({
			...d,
			meals: { ...d.meals, [meal]: d.meals[meal].filter((r) => r.id !== id) },
		}));

	const moveMealRow = (meal: MealKey, id: string, dir: "up" | "down") =>
		updateDay((d) => {
			const rows = [...d.meals[meal]];
			const idx = rows.findIndex((r) => r.id === id);
			if (idx < 0) return d;
			const j = dir === "up" ? idx - 1 : idx + 1;
			if (j < 0 || j >= rows.length) return d;
			const tmp = rows[idx];
			rows[idx] = rows[j];
			rows[j] = tmp;
			return { ...d, meals: { ...d.meals, [meal]: rows } };
		});

	const sortMealByPriority = (meal: MealKey) =>
		updateDay((d) => ({
			...d,
			meals: { ...d.meals, [meal]: sortByPriority(d.meals[meal]) },
		}));

	/* ---------- costs ---------- */
	const addCostRow = () =>
		updateDay((d) => ({
			...d,
			costs: [{ id: uid(), title: "", value: "", priority: 10 }, ...d.costs],
		}));

	const updateCostRow = (id: string, patch: Partial<RowItem>) =>
		updateDay((d) => ({
			...d,
			costs: d.costs.map((r) => (r.id === id ? { ...r, ...patch } : r)),
		}));

	const removeCostRow = (id: string) =>
		updateDay((d) => ({ ...d, costs: d.costs.filter((r) => r.id !== id) }));

	const moveCostRow = (id: string, dir: "up" | "down") =>
		updateDay((d) => {
			const rows = [...d.costs];
			const idx = rows.findIndex((r) => r.id === id);
			if (idx < 0) return d;
			const j = dir === "up" ? idx - 1 : idx + 1;
			if (j < 0 || j >= rows.length) return d;
			const tmp = rows[idx];
			rows[idx] = rows[j];
			rows[j] = tmp;
			return { ...d, costs: rows };
		});

	const sortCostsByPriority = () =>
		updateDay((d) => ({ ...d, costs: sortByPriority(d.costs) }));

	/* ---------- habits ---------- */
	const addHabit = (title: string) =>
		updateDay((d) => ({
			...d,
			habits: [
				{ id: uid(), title, icon: "⭐", checked: false, priority: 10 },
				...d.habits,
			],
		}));

	const updateHabit = (id: string, patch: Partial<HabitItem>) =>
		updateDay((d) => ({
			...d,
			habits: d.habits.map((h) => (h.id === id ? { ...h, ...patch } : h)),
		}));

	const removeHabit = (id: string) =>
		updateDay((d) => ({ ...d, habits: d.habits.filter((h) => h.id !== id) }));

	const moveHabit = (id: string, dir: "up" | "down") =>
		updateDay((d) => {
			const rows = [...d.habits];
			const idx = rows.findIndex((h) => h.id === id);
			if (idx < 0) return d;
			const j = dir === "up" ? idx - 1 : idx + 1;
			if (j < 0 || j >= rows.length) return d;
			const tmp = rows[idx];
			rows[idx] = rows[j];
			rows[j] = tmp;
			return { ...d, habits: rows };
		});

	const sortHabitsByPriority = () =>
		updateDay((d) => ({ ...d, habits: sortByPriority(d.habits) }));

	/* ---------- sleep ---------- */
	const setSleepStart = (v: string | null) =>
		updateDay((d) => ({ ...d, sleep: { ...d.sleep, start: v } }));

	const setSleepEnd = (v: string | null) =>
		updateDay((d) => ({ ...d, sleep: { ...d.sleep, end: v } }));

	const addSleepPause = () =>
		updateDay((d) => ({
			...d,
			sleep: {
				...d.sleep,
				pauses: [...d.sleep.pauses, { id: uid(), start: "", end: "" }],
			},
		}));

	const updateSleepPause = (id: string, patch: Partial<SleepPause>) =>
		updateDay((d) => ({
			...d,
			sleep: {
				...d.sleep,
				pauses: d.sleep.pauses.map((p) =>
					p.id === id ? { ...p, ...patch } : p
				),
			},
		}));

	const removeSleepPause = (id: string) =>
		updateDay((d) => ({
			...d,
			sleep: { ...d.sleep, pauses: d.sleep.pauses.filter((p) => p.id !== id) },
		}));

	const sleepMinutes = calcSleep(day.sleep);
	const sleepTotalLabel =
		sleepMinutes === 0
			? "—"
			: `${Math.floor(sleepMinutes / 60)}h ${sleepMinutes % 60}m`;

	/* ---------- mood ---------- */
	const setMood = (m: MoodKey | null) => updateDay((d) => ({ ...d, mood: m }));

	/* ---------- notes fields ---------- */
	const setField = (
		field: "sentenceOfDay" | "gratitude" | "dailyCleaning" | "note",
		value: string
	) => updateDay((d) => ({ ...d, [field]: value }));

	/* ---------- todos ---------- */
	const addTodo = (text: string) =>
		updateDay((d) => ({
			...d,
			todos: [{ id: uid(), text, done: false, priority: 10 }, ...d.todos],
		}));

	const updateTodo = (id: string, patch: Partial<TodoItem>) =>
		updateDay((d) => ({
			...d,
			todos: d.todos.map((t) => (t.id === id ? { ...t, ...patch } : t)),
		}));

	const removeTodo = (id: string) =>
		updateDay((d) => ({ ...d, todos: d.todos.filter((t) => t.id !== id) }));

	const moveTodo = (id: string, dir: "up" | "down") =>
		updateDay((d) => {
			const rows = [...d.todos];
			const idx = rows.findIndex((t) => t.id === id);
			if (idx < 0) return d;
			const j = dir === "up" ? idx - 1 : idx + 1;
			if (j < 0 || j >= rows.length) return d;
			const tmp = rows[idx];
			rows[idx] = rows[j];
			rows[j] = tmp;
			return { ...d, todos: rows };
		});

	const sortTodosByPriority = () =>
		updateDay((d) => ({ ...d, todos: sortByPriority(d.todos) }));

	return {
		day,
		db,
		getDay,

		isDirty,
		lastSavedAt,
		saveNow,

		setWater,

		addMealRow,
		updateMealRow,
		removeMealRow,
		moveMealRow,
		sortMealByPriority,

		addCostRow,
		updateCostRow,
		removeCostRow,
		moveCostRow,
		sortCostsByPriority,

		addHabit,
		updateHabit,
		removeHabit,
		moveHabit,
		sortHabitsByPriority,

		setSleepStart,
		setSleepEnd,
		addSleepPause,
		updateSleepPause,
		removeSleepPause,
		sleepTotalLabel,

		setMood,

		setField,

		addTodo,
		updateTodo,
		removeTodo,
		moveTodo,
		sortTodosByPriority,
		addCleaningItem,
		updateCleaningItem,
		removeCleaningItem,
		moveCleaningItem,
		sortCleaningByPriority,
	};
}
