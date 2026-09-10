import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";

import ToolShell, { OutputBlock, WorkSurface } from "#/components/ToolShell";
import { toolHead } from "#/lib/seo";

export const Route = createFileRoute("/tools/ascii-converter")({
	head: () => toolHead("ascii-converter"),
	component: AsciiConverter,
});

type Mode = "toAscii" | "fromAscii";

const MODES: [Mode, string][] = [
	["toAscii", "Text → ASCII"],
	["fromAscii", "ASCII → Text"],
];

function AsciiConverter() {
	const [mode, setMode] = useState<Mode>("toAscii");
	const [input, setInput] = useState("");
	const output = useMemo(() => {
		if (!input) return "";
		if (mode === "toAscii")
			return [...input].map((c) => c.charCodeAt(0)).join(" ");
		return input
			.trim()
			.split(/\s+/)
			.map((n) => String.fromCharCode(Number.parseInt(n, 10)))
			.join("");
	}, [input, mode]);

	return (
		<ToolShell
			toolId="ascii-converter"
			title="ASCII Converter"
			description="Text ↔ ASCII codes"
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
				placeholder={mode === "toAscii" ? "Hello" : "72 101 108"}
				rows={5}
			/>
			<OutputBlock
				value={output}
				placeholder="converted output"
				copyLabel="Copy"
			/>
		</ToolShell>
	);
}
