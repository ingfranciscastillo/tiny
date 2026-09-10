import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";

import ToolShell, { OutputBlock, WorkSurface } from "#/components/ToolShell";
import { toolHead } from "#/lib/seo";

export const Route = createFileRoute("/tools/trim-lines")({
	head: () => toolHead("trim-lines"),
	component: TrimLines,
});

type Mode = "both" | "start" | "end";

const MODES: [Mode, string][] = [
	["both", "both"],
	["start", "start"],
	["end", "end"],
];

function TrimLines() {
	const [input, setInput] = useState("");
	const [mode, setMode] = useState<Mode>("both");
	const output = useMemo(() => {
		if (!input) return "";
		return input
			.split("\n")
			.map((l) => {
				if (mode === "start") return l.replace(/^\s+/, "");
				if (mode === "end") return l.replace(/\s+$/, "");
				return l.trim();
			})
			.join("\n");
	}, [input, mode]);

	return (
		<ToolShell
			toolId="trim-lines"
			title="Trim Lines"
			description="Remove whitespace from every line"
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
				placeholder="  lines with spaces  "
				rows={6}
			/>
			<OutputBlock
				value={output}
				placeholder="trimmed lines"
				copyLabel="Copy"
			/>
		</ToolShell>
	);
}
