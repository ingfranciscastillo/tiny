import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";

import ToolShell, { OutputBlock, WorkSurface } from "#/components/ToolShell";
import { toolHead } from "#/lib/seo";

export const Route = createFileRoute("/tools/slugify")({
	head: () => toolHead("slugify"),
	component: Slugify,
});

// Combining diacritical marks, stripped after NFKD normalization
const DIACRITICS = /\p{M}/gu;

const SEPARATORS: [string, string][] = [
	["-", "-"],
	["_", "_"],
	[".", "."],
];

function Slugify() {
	const [input, setInput] = useState("");
	const [separator, setSeparator] = useState("-");
	const output = useMemo(() => {
		if (!input) return "";
		const sepEscaped = separator.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
		return input
			.normalize("NFKD")
			.replace(DIACRITICS, "")
			.toLowerCase()
			.replace(/[^a-z0-9]+/g, separator)
			.replace(new RegExp(`^${sepEscaped}+|${sepEscaped}+$`, "g"), "");
	}, [input, separator]);

	return (
		<ToolShell
			toolId="slugify"
			title="Slugify"
			description="Convert text to URL slugs"
			runsLocally
		>
			<div className="flex items-center gap-2">
				<span className="font-mono text-[11px] uppercase tracking-wide text-muted">
					separator
				</span>
				{SEPARATORS.map(([s, l]) => (
					<button
						key={s}
						type="button"
						onClick={() => setSeparator(s)}
						className={`font-mono text-xs px-2.5 py-1 border border-rule transition-tiny ${
							separator === s
								? "bg-accent-soft text-accent"
								: "hover:text-accent"
						}`}
					>
						{l}
					</button>
				))}
			</div>
			<WorkSurface
				label="input"
				value={input}
				onChange={(e) => setInput(e.target.value)}
				placeholder="Hello World! This is a title"
				rows={4}
			/>
			<OutputBlock
				value={output}
				placeholder="hello-world-this-is-a-title"
				copyLabel="Copy"
			/>
		</ToolShell>
	);
}
