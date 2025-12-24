export function toDateKey(d: Date) {
	const yyyy = d.getFullYear();
	const mm = String(d.getMonth() + 1).padStart(2, "0");
	const dd = String(d.getDate()).padStart(2, "0");
	return `${yyyy}-${mm}-${dd}`;
}

export function fromDateKey(key: string) {
	const [y, m, d] = key.split("-").map(Number);
	return new Date(y, m - 1, d);
}

export function addDays(date: Date, delta: number) {
	const d = new Date(date);
	d.setDate(d.getDate() + delta);
	return d;
}

export function weekKeysAround(date: Date) {
	const d = new Date(date);
	const day = d.getDay(); // 0 Sunday
	const start = addDays(d, -day);
	return Array.from({ length: 7 }, (_, i) => toDateKey(addDays(start, i)));
}

// Persian (Jalali) formatted date like: چهارشنبه ۳ دی ۱۴۰۴
export function formatPersianPretty(date: Date) {
	return new Intl.DateTimeFormat("fa-IR-u-ca-persian", {
		weekday: "long",
		year: "numeric",
		month: "long",
		day: "numeric",
	}).format(date);
}

// Short weekday in Persian
export function formatPersianWeekdayShort(date: Date) {
	return new Intl.DateTimeFormat("fa-IR-u-ca-persian", {
		weekday: "short",
	}).format(date);
}
