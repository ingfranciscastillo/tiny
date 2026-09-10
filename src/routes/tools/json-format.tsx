import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";

import ToolShell, { OutputBlock, WorkSurface } from "#/components/ToolShell";

export const Route = createFileRoute("/tools/json-format")({
	component: JsonFormatter,
});

type Mode = "beautify" | "minify";

function JsonFormatter() {
	const [input, setInput] = useState("");
	const [indent, setIndent] = useState(2);
	const [mode, setMode] = useState<Mode>("beautify");

	const output = useMemo(() => {
		if (!input.trim()) return "";
		try {
			const parsed = JSON.parse(input);
			if (mode === "minify") return JSON.stringify(parsed);
			return JSON.stringify(parsed, null, indent);
		} catch {
			return null;
		}
	}, [input, indent, mode]);

	const error = input.trim() && output === null ? "invalid JSON" : null;

	return (
		<ToolShell
			toolId="json-format"
			title="JSON Formatter"
			description="Beautify or minify JSON"
			runsLocally
		>
			<div className="flex items-center gap-2">
				{(["beautify", "minify"] as const).map((m) => (
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
				<div className="flex items-center gap-1.5 ml-2">
					<label
						htmlFor="json-indent"
						className="font-mono text-[11px] uppercase tracking-wide text-muted"
					>
						indent
					</label>
					<input
						id="json-indent"
						type="number"
						min="0"
						max="8"
						value={indent}
						onChange={(e) => setIndent(Number(e.target.value))}
						className="w-14 font-mono text-sm bg-surface border border-rule rounded-none px-2 py-1 focus:outline-none focus:border-accent transition-tiny"
					/>
				</div>
			</div>
			<WorkSurface
				label="input"
				value={input}
				onChange={(e) => setInput(e.target.value)}
				placeholder={'{"key":"value"}'}
				rows={8}
			/>
			{error && (
				<div className="font-mono text-xs text-accent border-l-2 border-accent pl-3 py-1">
					{error}
				</div>
			)}
			<OutputBlock
				value={error ? "" : output || ""}
				placeholder="formatted JSON"
				copyLabel="Copy"
				downloadName="formatted.json"
			/>
		</ToolShell>
	);
}
