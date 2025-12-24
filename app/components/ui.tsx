export function Card(props: React.HTMLAttributes<HTMLDivElement>) {
	return (
		<div
			{...props}
			className={
				"rounded-2xl border bg-white p-4 text-gray-900 shadow-sm " +
				(props.className ?? "")
			}
		/>
	);
}

export function Label({ children }: { children: React.ReactNode }) {
	return <div className="text-sm font-semibold">{children}</div>;
}

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
	return (
		<input {...props} className="w-full rounded-xl border px-3 py-2 text-sm" />
	);
}

export function TextArea(
	props: React.TextareaHTMLAttributes<HTMLTextAreaElement>
) {
	return (
		<textarea
			{...props}
			className="w-full rounded-xl border px-3 py-2 text-sm"
		/>
	);
}

export function IconCheck({ checked }: { checked: boolean }) {
	return (
		<div
			className={
				"h-6 w-6 rounded-md border flex items-center justify-center " +
				(checked ? "bg-black text-white" : "")
			}
		>
			{checked ? "✓" : ""}
		</div>
	);
}
