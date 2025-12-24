"use client";

import { useMemo, useRef, useState } from "react";
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

const uid = () => crypto.randomUUID();

/* ---------- helpers ---------- */

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

function formatHM(mins: number) {
	if (!mins) return "—";
	const h = Math.floor(mins / 60);
	const m = mins % 60;
	return `${h}h ${m}m`;
}

function emptyRow(): RowItem {
	return { id: uid(), title: "", value: "", priority: 10 };
}

function emptyHabit(): HabitItem {
	return { id: uid(), title: "", checked: false, priority: 10 };
}

function emptyTodo(text = ""): TodoItem {
	return { id: uid(), text, done: false, priority: 10 };
}

function emptyDay(dateKey: string): DailyData {
	return {
		dateKey,

		waterCups: Array(8).fill(false),

		meals: { breakfast: [], lunch: [], snack: [], dinner: [] },
		costs: [],
		habits: [],

		sleep: { start: null, end: null, pauses: [] },
		mood: null,

		sentenceOfDay: "",
		gratitude: "",
		dailyCleaning: "",
		note: "",

		todos: [],
	};
}

function loadDB(): PlannerDB {
	if (typeof window === "undefined") {
		// Server render / build time
		return { version: 7, days: {} };
	}

	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		if (!raw) return { version: 7, days: {} };

		const parsed = JSON.parse(raw) as PlannerDB;
		if (!parsed || typeof parsed !== "object") {
			return { version: 7, days: {} };
		}

		return parsed;
	} catch {
		return { version: 7, days: {} };
	}
}


function saveDB(db: PlannerDB) {
	if (typeof window === "undefined") return;
	localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
}

function sortByPriority<T extends { priority: number }>(arr: T[]) {
	return [...arr].sort((a, b) => a.priority - b.priority);
}

function moveById<T extends { id: string }>(
	arr: T[],
	id: string,
	dir: "up" | "down"
) {
	const idx = arr.findIndex((x) => x.id === id);
	if (idx === -1) return arr;

	const next = dir === "up" ? idx - 1 : idx + 1;
	if (next < 0 || next >= arr.length) return arr;

	const copy = [...arr];
	const tmp = copy[idx];
	copy[idx] = copy[next];
	copy[next] = tmp;
	return copy;
}

/* ---------- hook ---------- */

export function usePlanner(dateKey?: string) {
	const key = dateKey ?? toDateKey(new Date());

	// ✅ Load once (no setState-in-effect warning)
	const [db, setDB] = useState<PlannerDB>(() => loadDB());

	const hydrated = useRef(true);
	const [isDirty, setIsDirty] = useState(false);
	const [lastSavedAt, setLastSavedAt] = useState<number | null>(null);

	const day = useMemo(() => db.days[key] ?? emptyDay(key), [db.days, key]);

	function updateDay(fn: (d: DailyData) => DailyData) {
		setIsDirty(true);
		setDB((prev) => {
			const current = prev.days[key] ?? emptyDay(key);
			const nextDay = fn(current);
			return { ...prev, days: { ...prev.days, [key]: nextDay } };
		});
	}

	function setField<
		K extends keyof Pick<
			DailyData,
			"sentenceOfDay" | "gratitude" | "dailyCleaning" | "note"
		>
	>(field: K, value: DailyData[K]) {
		updateDay((d) => ({ ...d, [field]: value }));
	}

	function saveNow() {
		if (typeof window === "undefined") return;
		saveDB(db);
		setIsDirty(false);
		setLastSavedAt(Date.now());
	}


	function getDay(k: string) {
		return db.days[k] ?? emptyDay(k);
	}

	/* ---------- WATER ---------- */
	function setWater(idx: number, v: boolean) {
		updateDay((d) => {
			const next = [...d.waterCups];
			next[idx] = v;
			return { ...d, waterCups: next };
		});
	}

	/* ---------- MEALS ---------- */
	function addMealRow(meal: MealKey) {
		updateDay((d) => ({
			...d,
			meals: { ...d.meals, [meal]: [...d.meals[meal], emptyRow()] },
		}));
	}

	function updateMealRow(meal: MealKey, id: string, patch: Partial<RowItem>) {
		updateDay((d) => ({
			...d,
			meals: {
				...d.meals,
				[meal]: d.meals[meal].map((r) =>
					r.id === id ? { ...r, ...patch } : r
				),
			},
		}));
	}

	function removeMealRow(meal: MealKey, id: string) {
		updateDay((d) => ({
			...d,
			meals: { ...d.meals, [meal]: d.meals[meal].filter((r) => r.id !== id) },
		}));
	}

	function moveMealRow(meal: MealKey, id: string, dir: "up" | "down") {
		updateDay((d) => ({
			...d,
			meals: { ...d.meals, [meal]: moveById(d.meals[meal], id, dir) },
		}));
	}

	function sortMealByPriority(meal: MealKey) {
		updateDay((d) => ({
			...d,
			meals: { ...d.meals, [meal]: sortByPriority(d.meals[meal]) },
		}));
	}

	/* ---------- COSTS ---------- */
	function addCostRow() {
		updateDay((d) => ({ ...d, costs: [...d.costs, emptyRow()] }));
	}

	function updateCostRow(id: string, patch: Partial<RowItem>) {
		updateDay((d) => ({
			...d,
			costs: d.costs.map((r) => (r.id === id ? { ...r, ...patch } : r)),
		}));
	}

	function removeCostRow(id: string) {
		updateDay((d) => ({ ...d, costs: d.costs.filter((r) => r.id !== id) }));
	}

	function moveCostRow(id: string, dir: "up" | "down") {
		updateDay((d) => ({ ...d, costs: moveById(d.costs, id, dir) }));
	}

	function sortCostsByPriority() {
		updateDay((d) => ({ ...d, costs: sortByPriority(d.costs) }));
	}

	/* ---------- HABITS ---------- */
	function addHabit(title = "") {
		updateDay((d) => ({
			...d,
			habits: [...d.habits, { ...emptyHabit(), title }],
		}));
	}

	function updateHabit(id: string, patch: Partial<HabitItem>) {
		updateDay((d) => ({
			...d,
			habits: d.habits.map((h) => (h.id === id ? { ...h, ...patch } : h)),
		}));
	}

	function removeHabit(id: string) {
		updateDay((d) => ({ ...d, habits: d.habits.filter((h) => h.id !== id) }));
	}

	function moveHabit(id: string, dir: "up" | "down") {
		updateDay((d) => ({ ...d, habits: moveById(d.habits, id, dir) }));
	}

	function sortHabitsByPriority() {
		updateDay((d) => ({ ...d, habits: sortByPriority(d.habits) }));
	}

	/* ---------- TODOS ---------- */
	function addTodo(text = "") {
		updateDay((d) => ({ ...d, todos: [emptyTodo(text), ...d.todos] }));
	}

	function updateTodo(id: string, patch: Partial<TodoItem>) {
		updateDay((d) => ({
			...d,
			todos: d.todos.map((t) => (t.id === id ? { ...t, ...patch } : t)),
		}));
	}

	function removeTodo(id: string) {
		updateDay((d) => ({ ...d, todos: d.todos.filter((t) => t.id !== id) }));
	}

	function moveTodo(id: string, dir: "up" | "down") {
		updateDay((d) => ({ ...d, todos: moveById(d.todos, id, dir) }));
	}

	function sortTodosByPriority() {
		updateDay((d) => ({ ...d, todos: sortByPriority(d.todos) }));
	}

	/* ---------- SLEEP ---------- */
	function setSleepStart(v: string | null) {
		updateDay((d) => ({ ...d, sleep: { ...d.sleep, start: v } }));
	}

	function setSleepEnd(v: string | null) {
		updateDay((d) => ({ ...d, sleep: { ...d.sleep, end: v } }));
	}

	function addSleepPause() {
		updateDay((d) => ({
			...d,
			sleep: {
				...d.sleep,
				pauses: [...d.sleep.pauses, { id: uid(), start: "", end: "" }],
			},
		}));
	}

	function updateSleepPause(id: string, patch: Partial<SleepPause>) {
		updateDay((d) => ({
			...d,
			sleep: {
				...d.sleep,
				pauses: d.sleep.pauses.map((p) =>
					p.id === id ? { ...p, ...patch } : p
				),
			},
		}));
	}

	function removeSleepPause(id: string) {
		updateDay((d) => ({
			...d,
			sleep: { ...d.sleep, pauses: d.sleep.pauses.filter((p) => p.id !== id) },
		}));
	}

	const sleepMinutes = calcSleep(day.sleep);
	const sleepTotalLabel = formatHM(sleepMinutes);

	/* ---------- MOOD ---------- */
	function setMood(m: MoodKey | null) {
		updateDay((d) => ({ ...d, mood: m }));
	}

	return {
		// data
		day,
		db,
		getDay,

		// save state
		isDirty,
		lastSavedAt,
		saveNow,

		// fields
		setField,

		// water
		setWater,

		// meals
		addMealRow,
		updateMealRow,
		removeMealRow,
		moveMealRow,
		sortMealByPriority,

		// costs
		addCostRow,
		updateCostRow,
		removeCostRow,
		moveCostRow,
		sortCostsByPriority,

		// habits
		addHabit,
		updateHabit,
		removeHabit,
		moveHabit,
		sortHabitsByPriority,

		// todos
		addTodo,
		updateTodo,
		removeTodo,
		moveTodo,
		sortTodosByPriority,

		// sleep
		setSleepStart,
		setSleepEnd,
		addSleepPause,
		updateSleepPause,
		removeSleepPause,
		sleepTotalLabel,

		// mood
		setMood,
	};
}
