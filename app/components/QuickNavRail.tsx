"use client";

import { useEffect, useState } from "react";

type NavItem = {
	id: string;
	label: string;
	icon: string;
};

const ITEMS: NavItem[] = [
	{ id: "todos", label: "Todos", icon: "📝" },
	{ id: "sleep", label: "Sleep & Mood", icon: "😴" },
	{ id: "water", label: "Water", icon: "💧" },
	{ id: "costs", label: "Costs", icon: "💸" },
	{ id: "meals", label: "Meals", icon: "🍽️" },
	{ id: "habits", label: "Habits", icon: "✅" },
	{ id: "notes", label: "Notes", icon: "📓" },
];

export default function QuickNav() {
	const [active, setActive] = useState<string>("");

	useEffect(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((e) => {
					if (e.isIntersecting) {
						setActive(e.target.id);
					}
				});
			},
			{ rootMargin: "-40% 0px -55% 0px" }
		);

		ITEMS.forEach((item) => {
			const el = document.getElementById(item.id);
			if (el) observer.observe(el);
		});

		return () => observer.disconnect();
	}, []);

	return (
		<>
			{/* Desktop / Tablet */}
			<div
				className="fixed right-4 top-1/2 z-40 hidden -translate-y-1/2 flex-col gap-2 rounded-2xl p-2 shadow-md md:flex"
				style={{ background: "var(--p-surface)" }}
			>
				{ITEMS.map((item) => {
					const isActive = active === item.id;
					return (
						<button
							key={item.id}
							onClick={() =>
								document
									.getElementById(item.id)
									?.scrollIntoView({ behavior: "smooth", block: "start" })
							}
							className={
								"group relative flex h-11 w-11 items-center justify-center rounded-full transition " +
								(isActive
									? "bg-[var(--p-primary)] text-white"
									: "bg-white/80 hover:bg-white")
							}
							aria-label={item.label}
						>
							<span className="text-lg">{item.icon}</span>

							{/* Hover label */}
							<span className="pointer-events-none absolute right-14 whitespace-nowrap rounded-lg bg-black px-3 py-1 text-xs text-white opacity-0 transition group-hover:opacity-100">
								{item.label}
							</span>
						</button>
					);
				})}
			</div>

			{/* Mobile bottom bar */}
			<div
				className="fixed bottom-3 left-1/2 z-40 flex -translate-x-1/2 gap-2 rounded-2xl p-2 shadow-2xl md:hidden"
				style={{
					background: "color-mix(in srgb, var(--p-surface) 90%, transparent)",
					backdropFilter: "blur(20px)",
					WebkitBackdropFilter: "blur(20px)",
				}}
			>
				{ITEMS.map((item) => {
					const isActive = active === item.id;
					return (
						<button
							key={item.id}
							onClick={() =>
								document
									.getElementById(item.id)
									?.scrollIntoView({ behavior: "smooth", block: "start" })
							}
							className={
								"flex h-10 w-10 items-center justify-center rounded-xl transition " +
								(isActive
									? "bg-[var(--p-primary)] text-white"
									: "text-gray-700")
							}
							aria-label={item.label}
						>
							{item.icon}
						</button>
					);
				})}
			</div>
		</>
	);
}
