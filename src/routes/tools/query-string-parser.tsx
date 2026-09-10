import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";

import ToolShell, { OutputBlock, WorkSurface } from "#/components/ToolShell";
import { toolHead } from "#/lib/seo";

export const Route = createFileRoute("/tools/query-string-parser")({
	head: () => toolHead("query-string-parser"),
	component: QueryStringParser,
});

function QueryStringParser() {
	const [input, setInput] = useState("");
	const output = useMemo(() => {
		if (!input.trim()) return "";
		let qs = input.trim();
		if (qs.startsWith("?")) qs = qs.slice(1);
		if (qs.includes("?")) qs = qs.split("?")[1];
		if (qs.includes("#")) qs = qs.split("#")[0];
		const params = new URLSearchParams(qs);
		const obj: Record<string, string | string[]> = {};
		for (const [k, v] of params) {
			if (obj[k] === undefined) obj[k] = v;
			else if (Array.isArray(obj[k])) (obj[k] as string[]).push(v);
			else obj[k] = [obj[k] as string, v];
		}
		return JSON.stringify(obj, null, 2);
	}, [input]);

	return (
		<ToolShell
			toolId="query-string-parser"
			title="Query String Parser"
			description="Parse URL query parameters"
			runsLocally
		>
			<WorkSurface
				label="query string"
				value={input}
				onChange={(e) => setInput(e.target.value)}
				placeholder="?name=John&age=30&tags=a&tags=b"
				rows={4}
			/>
			<OutputBlock
				value={output}
				placeholder='{"name":"John","age":"30"}'
				copyLabel="Copy"
			/>
		</ToolShell>
	);
}
