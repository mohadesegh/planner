import "./globals.css";
import { Inter } from "next/font/google";

export const metadata = {
	title: "Planner",
	description: "Daily planner like the template images",
};


const inter = Inter({
	subsets: ["latin"],
	display: "swap",
	variable: "--font-inter",
});

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en" className={inter.variable}>
			<body>{children}</body>
		</html>
	);
}

