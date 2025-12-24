export function toDateKey(d: Date) {
	const y = d.getFullYear();
	const m = String(d.getMonth() + 1).padStart(2, "0");
	const da = String(d.getDate()).padStart(2, "0");
	return `${y}-${m}-${da}`;
}

export function fromDateKey(key: string) {
	const [y, m, d] = key.split("-").map(Number);
	return new Date(y, m - 1, d);
}

export function addDays(d: Date, n: number) {
	const x = new Date(d);
	x.setDate(x.getDate() + n);
	return x;
}

export function weekKeysAround(date: Date) {
	const start = addDays(date, -date.getDay());
	return Array.from({ length: 7 }, (_, i) => toDateKey(addDays(start, i)));
}

/**
 * Persian calendar date but English language output.
 * Example: "Wednesday, 3 Farvardin 1404"
 */
export function formatPersianPretty(date: Date) {
	return new Intl.DateTimeFormat("en-US-u-ca-persian", {
		weekday: "long",
		year: "numeric",
		month: "long",
		day: "numeric",
	}).format(date);
}

/**
 * Persian calendar weekday short but English output.
 * Example: "Wed"
 */
export function formatPersianWeekdayShort(date: Date) {
	return new Intl.DateTimeFormat("en-US-u-ca-persian", {
		weekday: "short",
	}).format(date);
}
