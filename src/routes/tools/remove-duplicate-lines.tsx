import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";

import ToolShell, { OutputBlock, WorkSurface } from "#/components/ToolShell";
import { toolHead } from "#/lib/seo";

export const Route = createFileRoute("/tools/remove-duplicate-lines")({
	head: () => toolHead("remove-duplicate-lines"),
	component: RemoveDuplicateLines,
});

function RemoveDuplicateLines() {
	const [input, setInput] = useState("");
	const [caseSensitive, setCaseSensitive] = useState(true);
	const output = useMemo(() => {
		if (!input) return "";
		const seen = new Set<string>();
		const out: string[] = [];
		for (const line of input.split("\n")) {
			const key = caseSensitive ? line : line.toLowerCase();
			if (!seen.has(key)) {
				seen.add(key);
				out.push(line);
			}
		}
		return out.join("\n");
	}, [input, caseSensitive]);
	const removed = input
		? input.split("\n").length - output.split("\n").length
		: 0;

	return (
		<ToolShell
			toolId="remove-duplicate-lines"
			title="Remove Duplicate Lines"
			description="Remove repeated lines"
			runsLocally
		>
			<label className="flex items-center gap-1.5 font-mono text-xs text-muted cursor-pointer">
				<input
					type="checkbox"
					checked={caseSensitive}
					onChange={(e) => setCaseSensitive(e.target.checked)}
					className="accent-accent"
				/>
				case sensitive
			</label>
			<WorkSurface
				label="input"
				value={input}
				onChange={(e) => setInput(e.target.value)}
				placeholder="paste lines"
				rows={6}
			/>
			{input && (
				<div className="font-mono text-xs text-muted">
					{removed} duplicate{removed !== 1 ? "s" : ""} removed
				</div>
			)}
			<OutputBlock value={output} placeholder="unique lines" copyLabel="Copy" />
		</ToolShell>
	);
}
