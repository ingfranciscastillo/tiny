import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import ToolShell, { OutputBlock, WorkSurface } from "#/components/ToolShell";

export const Route = createFileRoute("/tools/json-to-csv")({
	component: JsonToCsv,
});

type JsonToCsvResult = { error: string } | { csv: string };

function jsonToCsv(jsonText: string): JsonToCsvResult {
	let data: unknown;
	try {
		data = JSON.parse(jsonText);
	} catch (e) {
		return {
			error: `Invalid JSON: ${e instanceof Error ? e.message : String(e)}`,
		};
	}
	if (!Array.isArray(data))
		return { error: "Expected a JSON array of objects" };
	if (data.length === 0) return { csv: "" };
	const rows = data as Record<string, unknown>[];
	const keys = Array.from(
		rows.reduce((set, row) => {
			for (const k of Object.keys(row)) set.add(k);
			return set;
		}, new Set<string>()),
	);
	const esc = (v: unknown): string => {
		if (v == null) return "";
		const s = typeof v === "object" ? JSON.stringify(v) : String(v);
		return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
	};
	const lines = [keys.join(",")];
	for (const row of rows) lines.push(keys.map((k) => esc(row[k])).join(","));
	return { csv: lines.join("\n") };
}

function JsonToCsv() {
	const [input, setInput] = useState("");
	const result: JsonToCsvResult = input.trim() ? jsonToCsv(input) : { csv: "" };
	const output = "csv" in result ? result.csv : "";
	const error = "error" in result ? result.error : null;

	return (
		<ToolShell
			toolId="json-to-csv"
			title="JSON → CSV"
			description="Convert JSON arrays into CSV"
			runsLocally
		>
			<WorkSurface
				label="paste json"
				value={input}
				onChange={(e) => setInput(e.target.value)}
				placeholder={
					'[\n  {"name":"John","age":20},\n  {"name":"Jane","age":24}\n]'
				}
				rows={10}
			/>
			{error && (
				<div className="font-mono text-xs text-accent border-l-2 border-accent pl-3 py-1">
					{error}
				</div>
			)}
			<OutputBlock
				value={output}
				placeholder="name,age&#10;John,20&#10;Jane,24"
				copyLabel="Copy"
				downloadName="converted.csv"
			/>
		</ToolShell>
	);
}
