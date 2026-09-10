import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { usePalette } from "#/lib/palette-context";
import type { Tool } from "#/lib/tools";
import { CATEGORIES, searchTools, toolsByCategory } from "#/lib/tools";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
	const { openPalette } = usePalette();
	const [query, setQuery] = useState("");

	const isSearching = query.trim().length > 0;
	const results = useMemo(() => searchTools(query), [query]);

	return (
		<div className="max-w-3xl mx-auto px-5 sm:px-6 py-12 sm:py-20">
			{/* statement */}
			<div className="mb-10">
				<h1 className="font-heading text-3xl sm:text-4xl font-semibold tracking-tight leading-tight">
					small tools.
					<br />
					zero ceremony.
				</h1>
			</div>

			{/* inline search */}
			<div className="mb-12">
				<div className="flex items-center border border-rule bg-surface px-3.5">
					<span className="font-mono text-muted text-sm">/</span>
					<input
						value={query}
						onChange={(e) => setQuery(e.target.value)}
						placeholder="search tools"
						spellCheck={false}
						className="flex-1 bg-transparent font-mono text-sm px-2.5 py-3 focus:outline-none placeholder:text-muted/50"
					/>
					<button
						type="button"
						onClick={openPalette}
						className="font-mono text-[10px] text-muted border border-rule px-1.5 py-0.5 hover:text-accent transition-tiny"
					>
						⌘K
					</button>
				</div>
			</div>

			{/* tool list */}
			{isSearching ? (
				<ToolList tools={results} heading="RESULTS" />
			) : (
				<div className="space-y-10">
					{CATEGORIES.map((cat) => {
						const tools = toolsByCategory(cat.id);
						if (!tools.length) return null;
						return <ToolList key={cat.id} tools={tools} heading={cat.label} />;
					})}
				</div>
			)}
		</div>
	);
}

function ToolList({ tools, heading }: { tools: Tool[]; heading: string }) {
	return (
		<section>
			<h2 className="font-mono text-[11px] uppercase tracking-widest text-muted mb-1.5">
				{heading}
			</h2>
			<div className="border-t border-rule">
				{tools.map((tool) => (
					<Link
						key={tool.id}
						to={tool.path}
						className="flex items-baseline justify-between gap-4 border-b border-rule py-2.5 px-1 -mx-1 hover:bg-accent-soft transition-tiny group"
					>
						<span className="font-mono text-sm font-medium group-hover:text-accent transition-tiny">
							{tool.name}
						</span>
						<span className="text-xs text-muted text-right">
							{tool.description}
						</span>
					</Link>
				))}
			</div>
		</section>
	);
}
