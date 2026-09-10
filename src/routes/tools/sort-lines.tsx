import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import ToolShell, { OutputBlock, WorkSurface } from "#/components/ToolShell";
import { toolHead } from "#/lib/seo";

export const Route = createFileRoute("/tools/sort-lines")({
	head: () => toolHead("sort-lines"),
	component: SortLines,
});

type Mode = "asc" | "desc" | "reverse";

const MODES: { id: Mode; label: string }[] = [
	{ id: "asc", label: "A → Z" },
	{ id: "desc", label: "Z → A" },
	{ id: "reverse", label: "reverse" },
];

function SortLines() {
	const [input, setInput] = useState("");
	const [mode, setMode] = useState<Mode>("asc");
	const [dedupe, setDedupe] = useState(false);

	const output = useMemo(() => {
		if (!input) return "";
		let lines = input.split("\n");
		if (dedupe) lines = Array.from(new Set(lines));
		if (mode === "reverse") return lines.reverse().join("\n");
		const sorted = [...lines].sort((a, b) =>
			mode === "asc" ? a.localeCompare(b) : b.localeCompare(a),
		);
		return sorted.join("\n");
	}, [input, mode, dedupe]);

	return (
		<ToolShell
			toolId="sort-lines"
			title="Sort Lines"
			description="Order and deduplicate lines"
			runsLocally
		>
			<div className="flex flex-wrap items-center gap-2">
				{MODES.map((m) => (
					<button
						key={m.id}
						type="button"
						onClick={() => setMode(m.id)}
						className={`font-mono text-xs px-2.5 py-1 border border-rule transition-tiny ${
							mode === m.id ? "bg-accent-soft text-accent" : "hover:text-accent"
						}`}
					>
						{m.label}
					</button>
				))}
				<label className="flex items-center gap-1.5 font-mono text-xs text-muted cursor-pointer ml-2">
					<input
						type="checkbox"
						checked={dedupe}
						onChange={(e) => setDedupe(e.target.checked)}
						className="accent-accent"
					/>
					dedupe
				</label>
			</div>
			<WorkSurface
				label="input"
				value={input}
				onChange={(e) => setInput(e.target.value)}
				placeholder="one line per row"
				rows={6}
			/>
			<OutputBlock value={output} placeholder="sorted lines" copyLabel="Copy" />
		</ToolShell>
	);
}
