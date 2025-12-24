export function Card({
	children,
	className = "",
}: {
	children: React.ReactNode;
	className?: string;
}) {
	return (
		<div className={`p-card rounded-2xl p-4 ${className}`}>{children}</div>
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
