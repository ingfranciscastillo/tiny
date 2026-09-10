import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";

import ToolShell, { OutputBlock, WorkSurface } from "#/components/ToolShell";

export const Route = createFileRoute("/tools/case-converter")({
	component: CaseConverter,
});

const MODES = [
	"camel",
	"pascal",
	"snake",
	"kebab",
	"upper",
	"lower",
	"title",
] as const;

type Mode = (typeof MODES)[number];

function convert(text: string, mode: Mode): string {
	if (!text) return "";
	switch (mode) {
		case "camel":
			return text
				.replace(/[^a-zA-Z0-9]+(.)/g, (_, c) => c.toUpperCase())
				.replace(/^[A-Z]/, (c) => c.toLowerCase());
		case "pascal":
			return text
				.replace(/[^a-zA-Z0-9]+(.)/g, (_, c) => c.toUpperCase())
				.replace(/^[a-z]/, (c) => c.toUpperCase());
		case "snake":
			return text
				.trim()
				.replace(/([a-z])([A-Z])/g, "$1_$2")
				.replace(/[^a-zA-Z0-9]+/g, "_")
				.toLowerCase()
				.replace(/^_|_$/g, "");
		case "kebab":
			return text
				.trim()
				.replace(/([a-z])([A-Z])/g, "$1-$2")
				.replace(/[^a-zA-Z0-9]+/g, "-")
				.toLowerCase()
				.replace(/^-|-$/g, "");
		case "upper":
			return text.toUpperCase();
		case "lower":
			return text.toLowerCase();
		case "title":
			return text.replace(
				/\w\S*/g,
				(w) => w[0].toUpperCase() + w.slice(1).toLowerCase(),
			);
		default:
			return text;
	}
}

function CaseConverter() {
	const [input, setInput] = useState("");
	const [mode, setMode] = useState<Mode>("camel");
	const output = useMemo(() => convert(input, mode), [input, mode]);

	return (
		<ToolShell
			toolId="case"
			title="Case Converter"
			description="Convert text between naming conventions"
			runsLocally
		>
			<div className="flex flex-wrap gap-1">
				{MODES.map((m) => (
					<button
						key={m}
						type="button"
						onClick={() => setMode(m)}
						className={`font-mono text-xs px-2.5 py-1 border border-rule transition-tiny ${
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
				placeholder="some text or identifier"
				rows={4}
			/>
			<OutputBlock
				value={output}
				placeholder="converted text"
				copyLabel="Copy"
			/>
		</ToolShell>
	);
}
