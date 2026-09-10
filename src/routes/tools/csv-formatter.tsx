import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";

import ToolShell, { OutputBlock, WorkSurface } from "#/components/ToolShell";
import { parseCsv } from "#/lib/csv";
import { toolHead } from "#/lib/seo";

export const Route = createFileRoute("/tools/csv-formatter")({
	head: () => toolHead("csv-formatter"),
	component: CsvFormatter,
});

function toCsv(rows: string[][]): string {
	return rows
		.map((r) =>
			r
				.map((c) => {
					const s = String(c ?? "");
					return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
				})
				.join(","),
		)
		.join("\n");
}

function CsvFormatter() {
	const [input, setInput] = useState("");
	const output = useMemo(() => {
		if (!input.trim()) return "";
		return toCsv(parseCsv(input));
	}, [input]);

	return (
		<ToolShell
			toolId="csv-formatter"
			title="CSV Formatter"
			description="Format messy CSV"
			runsLocally
		>
			<WorkSurface
				label="csv"
				value={input}
				onChange={(e) => setInput(e.target.value)}
				placeholder={"a,b,c\n1,2,3"}
				rows={8}
			/>
			<OutputBlock
				value={output}
				placeholder="clean csv"
				copyLabel="Copy"
				downloadName="formatted.csv"
			/>
		</ToolShell>
	);
}
