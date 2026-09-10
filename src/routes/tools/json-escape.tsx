import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import ToolShell, { OutputBlock, WorkSurface } from "#/components/ToolShell";

export const Route = createFileRoute("/tools/json-escape")({
	component: JsonEscape,
});

type Mode = "escape" | "unescape";

function JsonEscape() {
	const [mode, setMode] = useState<Mode>("escape");
	const [input, setInput] = useState("");

	let output = "";
	if (input) {
		output =
			mode === "escape"
				? input
						.replace(/\\/g, "\\\\")
						.replace(/"/g, '\\"')
						.replace(/\n/g, "\\n")
						.replace(/\r/g, "\\r")
						.replace(/\t/g, "\\t")
				: input
						.replace(/\\n/g, "\n")
						.replace(/\\r/g, "\r")
						.replace(/\\t/g, "\t")
						.replace(/\\"/g, '"')
						.replace(/\\\\/g, "\\");
	}

	return (
		<ToolShell
			toolId="json-escape"
			title="JSON Escape"
			description="Escape or unescape strings for JSON"
			runsLocally
		>
			<div className="flex items-center gap-1">
				{(["escape", "unescape"] as const).map((m) => (
					<button
						key={m}
						type="button"
						onClick={() => setMode(m)}
						className={`font-mono text-xs uppercase tracking-wide px-3 py-1.5 border border-rule transition-tiny ${
							mode === m ? "bg-accent-soft text-accent" : "hover:text-accent"
						}`}
					>
						{m}
					</button>
				))}
			</div>
			<WorkSurface
				label="input"
				value={input}
				onChange={(e) => setInput(e.target.value)}
				placeholder="text to escape"
				rows={6}
			/>
			<OutputBlock
				value={output}
				placeholder="escaped string"
				copyLabel="Copy"
			/>
		</ToolShell>
	);
}
