import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";

import ToolShell, { OutputBlock, WorkSurface } from "#/components/ToolShell";
import { toolHead } from "#/lib/seo";

export const Route = createFileRoute("/tools/table-to-json")({
	head: () => toolHead("table-to-json"),
	component: TableToJson,
});

const DELIMITERS: [string, string][] = [
	["\t", "tab"],
	[",", "comma"],
	["|", "pipe"],
	[";", "semi"],
];

function TableToJson() {
	const [input, setInput] = useState("");
	const [delim, setDelim] = useState("\t");
	const output = useMemo(() => {
		if (!input.trim()) return "";
		const lines = input.trim().split("\n");
		if (lines.length < 2) return "[]";
		const headers = lines[0].split(delim).map((h) => h.trim());
		const rows = lines.slice(1).map((line) => {
			const cells = line.split(delim);
			const obj: Record<string, string> = {};
			headers.forEach((h, i) => {
				obj[h] = (cells[i] ?? "").trim();
			});
			return obj;
		});
		return JSON.stringify(rows, null, 2);
	}, [input, delim]);

	return (
		<ToolShell
			toolId="table-to-json"
			title="Table → JSON"
			description="Convert tabular data to JSON"
			runsLocally
		>
			<div className="flex items-center gap-2">
				<span className="font-mono text-[11px] uppercase tracking-wide text-muted">
					delimiter
				</span>
				{DELIMITERS.map(([d, l]) => (
					<button
						key={l}
						type="button"
						onClick={() => setDelim(d)}
						className={`font-mono text-xs px-2.5 py-1 border border-rule transition-tiny ${
							delim === d ? "bg-accent-soft text-accent" : "hover:text-accent"
						}`}
					>
						{l}
					</button>
				))}
			</div>
			<WorkSurface
				label="table"
				value={input}
				onChange={(e) => setInput(e.target.value)}
				placeholder={"name\tage\nJohn\t30"}
				rows={6}
			/>
			<OutputBlock
				value={output}
				placeholder='[{"name":"John"}]'
				copyLabel="Copy"
				downloadName="converted.json"
			/>
		</ToolShell>
	);
}
