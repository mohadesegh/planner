"use client";

import { useEffect, useState } from "react";

export type QuickNavItem = { id: string; label: string };

export default function QuickNavRail({
	items,
	offset = 90,
}: {
	items: QuickNavItem[];
	offset?: number;
}) {
	const [activeId, setActiveId] = useState(items[0]?.id ?? "");

	function scrollTo(id: string) {
		const el = document.getElementById(id);
		if (!el) return;
		const top = el.getBoundingClientRect().top + window.scrollY - offset;
		window.scrollTo({ top, behavior: "smooth" });
	}

	useEffect(() => {
		const els = items
			.map((n) => document.getElementById(n.id))
			.filter(Boolean) as HTMLElement[];

		if (els.length === 0) return;

		const io = new IntersectionObserver(
			(entries) => {
				const visible = entries
					.filter((e) => e.isIntersecting)
					.sort(
						(a, b) => (b.intersectionRatio ?? 0) - (a.intersectionRatio ?? 0)
					)[0];

				if (visible?.target?.id) setActiveId(visible.target.id);
			},
			{
				root: null,
				rootMargin: "-40% 0px -55% 0px",
				threshold: [0.01, 0.1, 0.25, 0.5],
			}
		);

		els.forEach((el) => io.observe(el));
		return () => io.disconnect();
	}, [items]);

	return (
		<div className="flex fixed right-4 top-1/2 -translate-y-1/2 z-50 flex-col gap-3">
			{items.map((it) => {
				const active = it.id === activeId;

				return (
					<button
						key={it.id}
						type="button"
						onClick={() => scrollTo(it.id)}
						className="group relative"
						aria-label={`Jump to ${it.label}`}
					>
						<span
							className={
								"block transition-all duration-200 " +
								(active
									? "h-4 w-2 rounded-full shadow-md"
									: "h-2 w-2 rounded-full opacity-50 group-hover:opacity-100")
							}
							style={{
								background: active ? "var(--p-accent)" : "var(--p-muted)",
								boxShadow: active
									? "0 0 0 3px rgba(0,0,0,0.1), 0 0 8px rgba(0,0,0,0.15)"
									: "none",
							}}
						/>

						<span
							className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 whitespace-nowrap
                         rounded-xl px-3 py-1 text-xs opacity-0 shadow transition group-hover:opacity-100"
							style={{
								background: "rgba(255,255,255,0.92)",
								border: "1px solid var(--p-border)",
								color: "var(--p-text)",
							}}
						>
							{it.label}
						</span>
					</button>
				);
			})}
		</div>
	);
}
