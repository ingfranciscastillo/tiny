import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";

import ToolShell, { OutputBlock, WorkSurface } from "#/components/ToolShell";
import { toolHead } from "#/lib/seo";

export const Route = createFileRoute("/tools/sql-formatter")({
	head: () => toolHead("sql-formatter"),
	component: SqlFormatter,
});

const KEYWORDS =
	/\b(SELECT|FROM|WHERE|AND|OR|INNER|LEFT|RIGHT|OUTER|JOIN|ON|GROUP|BY|ORDER|HAVING|LIMIT|OFFSET|INSERT|INTO|VALUES|UPDATE|SET|DELETE|CREATE|TABLE|ALTER|ADD|DROP|UNION|ALL|DISTINCT|AS|CASE|WHEN|THEN|ELSE|END|IN|NOT|NULL|IS|LIKE|BETWEEN|EXISTS|WITH|RETURNING)\b/gi;

function formatSql(sql: string): string {
	let out = sql.replace(/\s+/g, " ").trim();
	out = out.replace(KEYWORDS, (m) => `\n${m.toUpperCase()}`);
	out = out.replace(/^\n/, "");
	out = out.replace(/\bAND\b/gi, "\n  AND");
	out = out.replace(/\bOR\b/gi, "\n  OR");
	out = out.replace(/,/g, ",\n  ");
	return out;
}

function SqlFormatter() {
	const [input, setInput] = useState("");
	const output = useMemo(() => (input.trim() ? formatSql(input) : ""), [input]);
	return (
		<ToolShell
			toolId="sql-formatter"
			title="SQL Formatter"
			description="Format SQL queries"
			runsLocally
		>
			<WorkSurface
				label="sql"
				value={input}
				onChange={(e) => setInput(e.target.value)}
				placeholder="select * from users where age > 18 order by name"
				rows={6}
			/>
			<OutputBlock
				value={output}
				placeholder="formatted SQL"
				copyLabel="Copy"
				downloadName="query.sql"
			/>
		</ToolShell>
	);
}
