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
		<div className="rounded-2xl border bg-white text-black p-4 shadow-sm">
			<button
				type="button"
				className="flex w-full items-start justify-between gap-3 text-left"
				onClick={() => setOpen((v) => !v)}
				aria-expanded={open}
				aria-controls={contentId}
			>
				<div>
					<div className="text-xs font-semibold tracking-widest text-black">
						{title}
					</div>
					{subtitle && (
						<div className="mt-1 text-sm text-black">{subtitle}</div>
					)}
				</div>

				<div className="flex items-center gap-3">
					{rightSlot}
					<span
						className={
							"select-none rounded-xl border bg-white px-3 py-2 text-sm transition-transform duration-300 " +
							(open ? "rotate-180" : "rotate-0")
						}
						aria-hidden="true"
					>
						▾
					</span>
				</div>
			</button>

			{/* Animated accordion body */}
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
