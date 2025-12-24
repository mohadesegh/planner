"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function PlannerShell({
	children,
}: {
	children: React.ReactNode;
}) {
	const path = usePathname();
	const isDaily = path === "/";
	const isOverview = path?.startsWith("/overview");

	return (
		<div className="min-h-screen bg-gradient-to-br from-emerald-200 via-teal-200 to-amber-100">
			<div className="mx-auto max-w-6xl px-4 py-6">
				<header className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
					<div>
						<div className="text-2xl font-bold text-gray-900">Planner</div>
						<div className="text-sm text-gray-700">
							Daily page + weekly overview (press Save)
						</div>
					</div>

					<nav className="flex gap-2">
						<Link
							href="/"
							className={
								"rounded-xl border px-3 py-2 text-sm " +
								(isDaily ? "bg-black text-white" : "bg-white text-gray-800")
							}
						>
							Today / Daily
						</Link>
						<Link
							href="/overview"
							className={
								"rounded-xl border px-3 py-2 text-sm " +
								(isOverview ? "bg-black text-white" : "bg-white text-gray-800")
							}
						>
							Overview
						</Link>
					</nav>
				</header>

				{children}
			</div>
		</div>
	);
}
