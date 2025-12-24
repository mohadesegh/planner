"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type {
	DailyData,
	HabitItem,
	MealKey,
	MoodKey,
	PlannerDB,
	RowItem,
	TodoItem,
} from "./types";
import { toDateKey } from "./date";

const STORAGE_KEY = "planner_db_v3"; // bumped version

function uid() {
	return Math.random().toString(16).slice(2) + Date.now().toString(16);
}

function emptyDay(dateKey: string): DailyData {
	return {
		dateKey,
		waterCups: Array.from({ length: 8 }, () => false),

		meals: { breakfast: [], lunch: [], snack: [], dinner: [] },
		costs: [],
		habits: [],

		// NEW
		sleepHours: null,
		mood: null,

		sentenceOfDay: "",
		gratitude: "",
		dailyCleaning: "",
		note: "",

		todos: [],
	};
}

function loadDB(): PlannerDB {
	if (typeof window === "undefined") return { version: 3, days: {} };
	const raw = window.localStorage.getItem(STORAGE_KEY);
	if (!raw) return { version: 3, days: {} };
	try {
		const parsed = JSON.parse(raw) as PlannerDB;
		if (!parsed?.days) return { version: 3, days: {} };
		return parsed;
	} catch {
		return { version: 3, days: {} };
	}
}

function saveDB(db: PlannerDB) {
	window.localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
}

function sortByPriority<T extends { priority: number }>(items: T[]) {
	return [...items].sort((a, b) => a.priority - b.priority);
}

export function usePlanner(dateKey?: string) {
	const key = dateKey ?? toDateKey(new Date());
	const [db, setDB] = useState<PlannerDB>({ version: 3, days: {} });

	const hydratedRef = useRef(false);
	const [isDirty, setIsDirty] = useState(false);
	const [lastSavedAt, setLastSavedAt] = useState<number | null>(null);

	useEffect(() => {
		const loaded = loadDB();
		setDB(loaded);
		hydratedRef.current = true;
		setIsDirty(false);
		setLastSavedAt(Date.now());
	}, []);

	const day: DailyData = useMemo(() => {
		return db.days[key] ?? emptyDay(key);
	}, [db.days, key]);

	function updateDay(updater: (current: DailyData) => DailyData) {
		setIsDirty(true);
		setDB((prev) => {
			const current = prev.days[key] ?? emptyDay(key);
			const next = updater(current);
			return { ...prev, days: { ...prev.days, [key]: next } };
		});
	}

	function saveNow() {
		if (!hydratedRef.current) return;
		saveDB(db);
		setIsDirty(false);
		setLastSavedAt(Date.now());
	}

	// --- NEW: sleep + mood ---
	function setSleepHours(v: number | null) {
		updateDay((current) => ({ ...current, sleepHours: v }));
	}

	function setMood(v: MoodKey | null) {
		updateDay((current) => ({ ...current, mood: v }));
	}

	// ---- Water ----
	function setWater(index: number, value: boolean) {
		updateDay((current) => {
			const next = [...current.waterCups];
			next[index] = value;
			return { ...current, waterCups: next };
		});
	}

	// ---- RowList helpers ----
	function addRow(list: RowItem[], defaults?: Partial<RowItem>) {
		const item: RowItem = {
			id: uid(),
			title: "",
			value: "",
			priority: 10,
			...defaults,
		};
		return [item, ...list];
	}
	function updateRow(list: RowItem[], id: string, patch: Partial<RowItem>) {
		return list.map((r) => (r.id === id ? { ...r, ...patch } : r));
	}
	function removeRow(list: RowItem[], id: string) {
		return list.filter((r) => r.id !== id);
	}
	function moveRow(list: RowItem[], id: string, dir: "up" | "down") {
		const idx = list.findIndex((x) => x.id === id);
		const swapWith = dir === "up" ? idx - 1 : idx + 1;
		if (idx < 0 || swapWith < 0 || swapWith >= list.length) return list;
		const copy = [...list];
		const tmp = copy[idx];
		copy[idx] = copy[swapWith];
		copy[swapWith] = tmp;
		return copy;
	}

	// ---- Costs ----
	function addCostRow() {
		updateDay((current) => ({
			...current,
			costs: addRow(current.costs, { priority: 10 }),
		}));
	}
	function updateCostRow(id: string, patch: Partial<RowItem>) {
		updateDay((current) => ({
			...current,
			costs: updateRow(current.costs, id, patch),
		}));
	}
	function removeCostRow(id: string) {
		updateDay((current) => ({
			...current,
			costs: removeRow(current.costs, id),
		}));
	}
	function moveCostRow(id: string, dir: "up" | "down") {
		updateDay((current) => ({
			...current,
			costs: moveRow(current.costs, id, dir),
		}));
	}
	function sortCostsByPriority() {
		updateDay((current) => ({
			...current,
			costs: sortByPriority(current.costs),
		}));
	}

	// ---- Meals ----
	function addMealRow(meal: MealKey) {
		updateDay((current) => ({
			...current,
			meals: {
				...current.meals,
				[meal]: addRow(current.meals[meal], { priority: 10 }),
			},
		}));
	}
	function updateMealRow(meal: MealKey, id: string, patch: Partial<RowItem>) {
		updateDay((current) => ({
			...current,
			meals: {
				...current.meals,
				[meal]: updateRow(current.meals[meal], id, patch),
			},
		}));
	}
	function removeMealRow(meal: MealKey, id: string) {
		updateDay((current) => ({
			...current,
			meals: { ...current.meals, [meal]: removeRow(current.meals[meal], id) },
		}));
	}
	function moveMealRow(meal: MealKey, id: string, dir: "up" | "down") {
		updateDay((current) => ({
			...current,
			meals: {
				...current.meals,
				[meal]: moveRow(current.meals[meal], id, dir),
			},
		}));
	}
	function sortMealByPriority(meal: MealKey) {
		updateDay((current) => ({
			...current,
			meals: { ...current.meals, [meal]: sortByPriority(current.meals[meal]) },
		}));
	}

	// ---- Habits ----
	function addHabit(title = "") {
		const item: HabitItem = { id: uid(), title, checked: false, priority: 10 };
		updateDay((current) => ({ ...current, habits: [item, ...current.habits] }));
	}
	function updateHabit(id: string, patch: Partial<HabitItem>) {
		updateDay((current) => ({
			...current,
			habits: current.habits.map((h) => (h.id === id ? { ...h, ...patch } : h)),
		}));
	}
	function removeHabit(id: string) {
		updateDay((current) => ({
			...current,
			habits: current.habits.filter((h) => h.id !== id),
		}));
	}
	function moveHabit(id: string, dir: "up" | "down") {
		updateDay((current) => {
			const idx = current.habits.findIndex((h) => h.id === id);
			const swap = dir === "up" ? idx - 1 : idx + 1;
			if (idx < 0 || swap < 0 || swap >= current.habits.length) return current;
			const copy = [...current.habits];
			const tmp = copy[idx];
			copy[idx] = copy[swap];
			copy[swap] = tmp;
			return { ...current, habits: copy };
		});
	}
	function sortHabitsByPriority() {
		updateDay((current) => ({
			...current,
			habits: sortByPriority(current.habits),
		}));
	}

	// ---- Todos ----
	function addTodo(text = "") {
		const item: TodoItem = { id: uid(), text, done: false, priority: 10 };
		updateDay((current) => ({ ...current, todos: [item, ...current.todos] }));
	}
	function updateTodo(id: string, patch: Partial<TodoItem>) {
		updateDay((current) => ({
			...current,
			todos: current.todos.map((t) => (t.id === id ? { ...t, ...patch } : t)),
		}));
	}
	function removeTodo(id: string) {
		updateDay((current) => ({
			...current,
			todos: current.todos.filter((t) => t.id !== id),
		}));
	}
	function moveTodo(id: string, dir: "up" | "down") {
		updateDay((current) => {
			const idx = current.todos.findIndex((t) => t.id === id);
			const swap = dir === "up" ? idx - 1 : idx + 1;
			if (idx < 0 || swap < 0 || swap >= current.todos.length) return current;
			const copy = [...current.todos];
			const tmp = copy[idx];
			copy[idx] = copy[swap];
			copy[swap] = tmp;
			return { ...current, todos: copy };
		});
	}
	function sortTodosByPriority() {
		updateDay((current) => ({
			...current,
			todos: sortByPriority(current.todos),
		}));
	}

	// ---- Notes fields ----
	function setField(
		field: "sentenceOfDay" | "gratitude" | "dailyCleaning" | "note",
		value: string
	) {
		updateDay((current) => ({ ...current, [field]: value }));
	}

	function getDay(dateKey: string) {
		return db.days[dateKey] ?? emptyDay(dateKey);
	}

	return {
		dateKey: key,
		day,
		db,
		getDay,

		// save button
		isDirty,
		lastSavedAt,
		saveNow,

		// NEW
		setSleepHours,
		setMood,

		// water
		setWater,

		// costs
		addCostRow,
		updateCostRow,
		removeCostRow,
		moveCostRow,
		sortCostsByPriority,

		// meals
		addMealRow,
		updateMealRow,
		removeMealRow,
		moveMealRow,
		sortMealByPriority,

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

		// notes
		setField,
	};
}
