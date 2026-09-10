import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import ToolShell, { OutputBlock, WorkSurface } from "#/components/ToolShell";
import { toolHead } from "#/lib/seo";

export const Route = createFileRoute("/tools/csv-to-json")({
	head: () => toolHead("csv-to-json"),
	component: CsvToJson,
});

function csvToJson(csv: string): string {
	const rows: string[][] = [];
	let row: string[] = [];
	let field = "";
	let inQuotes = false;
	for (let i = 0; i < csv.length; i++) {
		const c = csv[i];
		if (inQuotes) {
			if (c === '"') {
				if (csv[i + 1] === '"') {
					field += '"';
					i++;
				} else inQuotes = false;
			} else field += c;
		} else {
			if (c === '"') inQuotes = true;
			else if (c === ",") {
				row.push(field);
				field = "";
			} else if (c === "\n") {
				row.push(field);
				rows.push(row);
				row = [];
				field = "";
			} else if (c === "\r") {
				// skip
			} else field += c;
		}
	}
	if (field !== "" || row.length) {
		row.push(field);
		rows.push(row);
	}
	if (rows.length === 0) return "[]";
	const headers = rows[0];
	const out = rows
		.slice(1)
		.filter((r) => r.length > 1 || r[0] !== "")
		.map((r) => {
			const obj: Record<string, string> = {};
			headers.forEach((h, i) => {
				obj[h] = r[i] ?? "";
			});
			return obj;
		});
	return JSON.stringify(out, null, 2);
}

function CsvToJson() {
	const [input, setInput] = useState("");
	let output = "";
	let error: string | null = null;
	if (input.trim()) {
		try {
			output = csvToJson(input);
		} catch {
			error = "could not parse CSV";
		}
	}

	return (
		<ToolShell
			toolId="csv-to-json"
			title="CSV → JSON"
			description="Convert CSV data into a JSON array"
			runsLocally
		>
			<WorkSurface
				label="paste csv"
				value={input}
				onChange={(e) => setInput(e.target.value)}
				placeholder={"name,age\nJohn,20\nJane,24"}
				rows={8}
			/>
			{error && (
				<div className="font-mono text-xs text-accent border-l-2 border-accent pl-3 py-1">
					{error}
				</div>
			)}
			<OutputBlock
				value={error ? "" : output}
				placeholder='[{"name":"John","age":"20"}]'
				copyLabel="Copy"
				downloadName="converted.json"
			/>
		</ToolShell>
	);
}
