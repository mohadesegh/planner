import "./globals.css";

export const metadata = {
	title: "Planner",
	description: "Daily planner like the template images",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en">
			<body>{children}</body>
		</html>
	);
}
