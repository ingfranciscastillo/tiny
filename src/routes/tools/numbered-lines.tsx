import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";

import ToolShell, { OutputBlock, WorkSurface } from "#/components/ToolShell";
import { toolHead } from "#/lib/seo";

export const Route = createFileRoute("/tools/numbered-lines")({
	head: () => toolHead("numbered-lines"),
	component: NumberedLines,
});

function NumberedLines() {
	const [input, setInput] = useState("");
	const [start, setStart] = useState(1);
	const [sep, setSep] = useState(". ");
	const output = useMemo(() => {
		if (!input) return "";
		return input
			.split("\n")
			.map((l, i) => `${i + start}${sep}${l}`)
			.join("\n");
	}, [input, start, sep]);

	return (
		<ToolShell
			toolId="numbered-lines"
			title="Numbered Lines"
			description="Add line numbers"
			runsLocally
		>
			<div className="flex items-end gap-3">
				<div>
					<label
						htmlFor="numbered-start"
						className="font-mono text-[11px] uppercase tracking-wide text-muted block mb-1.5"
					>
						start
					</label>
					<input
						id="numbered-start"
						type="number"
						value={start}
						onChange={(e) => setStart(Number(e.target.value))}
						className="w-20 font-mono text-sm bg-surface border border-rule rounded-none px-3 py-2 focus:outline-none focus:border-accent transition-tiny"
					/>
				</div>
				<div>
					<label
						htmlFor="numbered-sep"
						className="font-mono text-[11px] uppercase tracking-wide text-muted block mb-1.5"
					>
						separator
					</label>
					<input
						id="numbered-sep"
						value={sep}
						onChange={(e) => setSep(e.target.value)}
						spellCheck={false}
						className="w-24 font-mono text-sm bg-surface border border-rule rounded-none px-3 py-2 focus:outline-none focus:border-accent transition-tiny"
					/>
				</div>
			</div>
			<WorkSurface
				label="input"
				value={input}
				onChange={(e) => setInput(e.target.value)}
				placeholder="lines to number"
				rows={6}
			/>
			<OutputBlock
				value={output}
				placeholder="1. first line"
				copyLabel="Copy"
			/>
		</ToolShell>
	);
}
