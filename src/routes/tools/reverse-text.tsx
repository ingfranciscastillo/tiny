import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";

import ToolShell, { OutputBlock, WorkSurface } from "#/components/ToolShell";
import { toolHead } from "#/lib/seo";

export const Route = createFileRoute("/tools/reverse-text")({
	head: () => toolHead("reverse-text"),
	component: ReverseText,
});

type Mode = "chars" | "lines";

const MODES: [Mode, string][] = [
	["chars", "characters"],
	["lines", "lines"],
];

function ReverseText() {
	const [input, setInput] = useState("");
	const [mode, setMode] = useState<Mode>("chars");
	const output = useMemo(() => {
		if (!input) return "";
		if (mode === "chars") return [...input].reverse().join("");
		return input.split("\n").reverse().join("\n");
	}, [input, mode]);

	return (
		<ToolShell
			toolId="reverse-text"
			title="Reverse Text"
			description="Reverse characters or lines"
			runsLocally
		>
			<div className="flex items-center gap-1">
				{MODES.map(([m, l]) => (
					<button
						key={m}
						type="button"
						onClick={() => setMode(m)}
						className={`font-mono text-xs uppercase tracking-wide px-3 py-1.5 border border-rule transition-tiny ${
							mode === m ? "bg-accent-soft text-accent" : "hover:text-accent"
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
				placeholder="text to reverse"
				rows={6}
			/>
			<OutputBlock
				value={output}
				placeholder="reversed text"
				copyLabel="Copy"
			/>
		</ToolShell>
	);
}
