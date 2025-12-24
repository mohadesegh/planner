"use client";

import { useId, useState } from "react";

export default function AccordionSection({
	title,
	subtitle,
	defaultOpen = true,
	rightSlot,
	children,
}: {
	title: string;
	subtitle?: string;
	defaultOpen?: boolean;
	rightSlot?: React.ReactNode;
	children: React.ReactNode;
}) {
	const [open, setOpen] = useState(defaultOpen);
	const contentId = useId();

	return (
		<div className="p-card rounded-2xl p-4 shadow-sm">
			<button
				type="button"
				className="flex w-full items-start justify-between gap-3 text-left"
				onClick={() => setOpen((v) => !v)}
				aria-expanded={open}
				aria-controls={contentId}
			>
				<div>
					<div className="text-xs font-semibold tracking-widest">{title}</div>
					{subtitle ? (
						<div className="mt-1 text-sm" style={{ color: "var(--p-muted)" }}>
							{subtitle}
						</div>
					) : null}
				</div>

				<div className="flex items-center gap-3">
					{rightSlot}
					<span
						className={
							"select-none rounded-xl px-3 py-2 text-sm transition-transform duration-300 " +
							(open ? "rotate-180" : "rotate-0")
						}
						style={{
							border: "1px solid var(--p-border)",
							background: open ? "var(--p-mint)" : "rgba(252,249,234,0.9)",
							color: "var(--p-text)",
						}}
						aria-hidden="true"
					>
						▾
					</span>
				</div>
			</button>

			<div
				id={contentId}
				className={
					"grid transition-[grid-template-rows,opacity] duration-300 ease-in-out " +
					(open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0")
				}
			>
				<div className="overflow-hidden">
					<div className="pt-4">{children}</div>
				</div>
			</div>
		</div>
	);
}
