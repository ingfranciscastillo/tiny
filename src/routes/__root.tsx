import { TanStackDevtools } from "@tanstack/react-devtools";
import {
	createRootRoute,
	HeadContent,
	Link,
	Scripts,
} from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { PaletteProvider, usePalette } from "#/lib/palette-context";
import { TOOLS } from "#/lib/tools";
import { useTheme } from "#/lib/useTheme";
import { getLocale } from "#/paraglide/runtime";

import appCss from "../styles.css?url";

export const Route = createRootRoute({
	beforeLoad: async () => {
		// Other redirect strategies are possible; see
		// https://github.com/TanStack/router/tree/main/examples/react/i18n-paraglide#offline-redirect
		if (typeof document !== "undefined") {
			document.documentElement.setAttribute("lang", getLocale());
		}
	},

	head: () => ({
		meta: [
			{
				charSet: "utf-8",
			},
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1",
			},
			{
				title: "TanStack Start Starter",
			},
		],
		links: [
			{
				rel: "stylesheet",
				href: appCss,
			},
		],
	}),
	shellComponent: RootDocument,
});

function RootDocument({ children }: { children: React.ReactNode }) {
	return (
		<html lang={getLocale()}>
			<head>
				<HeadContent />
			</head>
			<body>
				<PaletteProvider>
					<AppShell>{children}</AppShell>
				</PaletteProvider>
				<TanStackDevtools
					config={{
						position: "bottom-right",
					}}
					plugins={[
						{
							name: "Tanstack Router",
							render: <TanStackRouterDevtoolsPanel />,
						},
					]}
				/>
				<Scripts />
			</body>
		</html>
	);
}

// Minimal site chrome: tiny logo, ⌘K trigger, theme toggle, quiet footer.
function AppShell({ children }: { children: React.ReactNode }) {
	const { theme, toggle } = useTheme();
	const { openPalette } = usePalette();

	return (
		<div className="min-h-screen flex flex-col">
			<header className="border-b border-rule">
				<div className="max-w-3xl mx-auto px-5 sm:px-6 h-14 flex items-center justify-between">
					<Link
						to="/"
						className="font-mono text-base font-medium tracking-tight hover:text-accent transition-tiny"
					>
						tiny
					</Link>
					<div className="flex items-center gap-4">
						<button
							type="button"
							onClick={openPalette}
							className="font-mono text-xs text-muted hover:text-accent transition-tiny flex items-center gap-2"
						>
							<span className="hidden sm:inline">search tools</span>
							<kbd className="font-mono text-[10px] border border-rule px-1.5 py-0.5">
								⌘K
							</kbd>
						</button>
						<button
							type="button"
							onClick={toggle}
							aria-label="Toggle theme"
							className="font-mono text-xs text-muted hover:text-accent transition-tiny"
						>
							{theme === "dark" ? "light" : "dark"}
						</button>
					</div>
				</div>
			</header>

			<main className="flex-1">{children}</main>

			<footer className="border-t border-rule">
				<div className="max-w-3xl mx-auto px-5 sm:px-6 py-5 flex items-center justify-between font-mono text-[11px] text-muted">
					<span>tiny · {TOOLS.length} tools · runs locally</span>
					<span className="flex items-center gap-3">
						{/* biome-ignore lint/a11y/useValidAnchor: placeholder until real GitHub/Privacy URLs are provided */}
						<a href="#" className="hover:text-accent transition-tiny">
							GitHub
						</a>
						<span className="opacity-40">·</span>
						{/* biome-ignore lint/a11y/useValidAnchor: placeholder until real GitHub/Privacy URLs are provided */}
						<a href="#" className="hover:text-accent transition-tiny">
							Privacy
						</a>
					</span>
				</div>
			</footer>
		</div>
	);
}
