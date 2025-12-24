import React from "react";

export function Card(props: React.HTMLAttributes<HTMLDivElement>) {
	return (
		<div
			{...props}
			className={
				"rounded-2xl border border-gray-200 bg-white text-gray-800 shadow-sm p-4 " +
				(props.className ?? "")
			}
		/>
	);
}

export function Label({ children }: { children: React.ReactNode }) {
	return <div className="text-sm font-semibold tracking-wide">{children}</div>;
}

export function TextArea(
	props: React.TextareaHTMLAttributes<HTMLTextAreaElement>
) {
	return (
		<textarea
			{...props}
			className={
				"w-full resize-none rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm outline-none " +
				"focus:ring-2 focus:ring-black/10 " +
				(props.className ?? "")
			}
		/>
	);
}

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
	return (
		<input
			{...props}
			className={
				"w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm outline-none " +
				"focus:ring-2 focus:ring-black/10 " +
				(props.className ?? "")
			}
		/>
	);
}

export function IconCheck({ checked }: { checked: boolean }) {
	return (
		<span
			className={
				"inline-flex h-6 w-6 items-center justify-center rounded-md border border-gray-300 " +
				(checked ? "bg-black text-white" : "bg-white")
			}
			aria-hidden
		>
			{checked ? "✓" : ""}
		</span>
	);
}
