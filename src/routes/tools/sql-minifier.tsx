import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";

import ToolShell, { OutputBlock, WorkSurface } from "#/components/ToolShell";
import { toolHead } from "#/lib/seo";

export const Route = createFileRoute("/tools/sql-minifier")({
	head: () => toolHead("sql-minifier"),
	component: SqlMinifier,
});

function SqlMinifier() {
	const [input, setInput] = useState("");
	const output = useMemo(() => {
		if (!input.trim()) return "";
		return input
			.replace(/\s+/g, " ")
			.replace(/\s*([(),])\s*/g, "$1")
			.replace(/\s*(=|<>|<=|>=)\s*/g, "$1")
			.trim();
	}, [input]);
	return (
		<ToolShell
			toolId="sql-minifier"
			title="SQL Minifier"
			description="Minify SQL"
			runsLocally
		>
			<WorkSurface
				label="sql"
				value={input}
				onChange={(e) => setInput(e.target.value)}
				placeholder="SELECT * FROM users"
				rows={6}
			/>
			<OutputBlock value={output} placeholder="minified SQL" copyLabel="Copy" />
		</ToolShell>
	);
}
