import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";

import ToolShell, { OutputBlock, WorkSurface } from "#/components/ToolShell";
import { parseCsv } from "#/lib/csv";
import { toolHead } from "#/lib/seo";

export const Route = createFileRoute("/tools/csv-to-markdown")({
	head: () => toolHead("csv-to-markdown"),
	component: CsvToMarkdown,
});

function CsvToMarkdown() {
	const [input, setInput] = useState("");
	const output = useMemo(() => {
		if (!input.trim()) return "";
		const rows = parseCsv(input);
		if (rows.length === 0) return "";
		const headers = rows[0];
		const md = [
			`| ${headers.join(" | ")} |`,
			`| ${headers.map(() => "---").join(" | ")} |`,
		];
		for (const r of rows.slice(1)) md.push(`| ${r.join(" | ")} |`);
		return md.join("\n");
	}, [input]);

	return (
		<ToolShell
			toolId="csv-to-markdown"
			title="CSV → Markdown"
			description="Convert CSV to Markdown table"
			runsLocally
		>
			<WorkSurface
				label="csv"
				value={input}
				onChange={(e) => setInput(e.target.value)}
				placeholder={"name,age\nJohn,30"}
				rows={6}
			/>
			<OutputBlock
				value={output}
				placeholder="| name | age |"
				copyLabel="Copy"
			/>
		</ToolShell>
	);
}
