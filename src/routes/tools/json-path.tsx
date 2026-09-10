import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";

import ToolShell, { OutputBlock, WorkSurface } from "#/components/ToolShell";
import { toolHead } from "#/lib/seo";

export const Route = createFileRoute("/tools/json-path")({
	head: () => toolHead("json-path"),
	component: JsonPath,
});

// biome-ignore-start lint/suspicious/noExplicitAny: walking an arbitrary parsed JSON value
function getByPath(obj: any, path: string): any {
	const parts = path.split(".").filter(Boolean);
	let cur = obj;
	for (const p of parts) {
		if (cur == null) return undefined;
		const m = p.match(/^(\w+)\[(\d+)\]$/);
		if (m) {
			cur = cur[m[1]]?.[Number.parseInt(m[2], 10)];
		} else if (/^\d+$/.test(p) && Array.isArray(cur)) {
			cur = cur[Number.parseInt(p, 10)];
		} else {
			cur = cur[p];
		}
	}
	return cur;
}
// biome-ignore-end lint/suspicious/noExplicitAny: walking an arbitrary parsed JSON value

function JsonPath() {
	const [input, setInput] = useState("");
	const [path, setPath] = useState("");
	const { output, error } = useMemo(() => {
		if (!input.trim() || !path.trim()) return { output: "", error: null };
		try {
			return {
				output: JSON.stringify(getByPath(JSON.parse(input), path), null, 2),
				error: null,
			};
		} catch {
			return { output: "", error: "invalid JSON or path" };
		}
	}, [input, path]);

	return (
		<ToolShell
			toolId="json-path"
			title="JSON Path Tester"
			description="Test JSONPath expressions"
			runsLocally
		>
			<div>
				<label
					htmlFor="json-path-expr"
					className="font-mono text-[11px] uppercase tracking-wide text-muted block mb-1.5"
				>
					path
				</label>
				<input
					id="json-path-expr"
					value={path}
					onChange={(e) => setPath(e.target.value)}
					placeholder="store.book[0].title"
					spellCheck={false}
					className="w-full font-mono text-sm bg-surface border border-rule rounded-none px-3 py-2 focus:outline-none focus:border-accent transition-tiny"
				/>
			</div>
			<WorkSurface
				label="json"
				value={input}
				onChange={(e) => setInput(e.target.value)}
				placeholder='{"store":{"book":[{"title":"Dune"}]}}'
				rows={6}
			/>
			{error && (
				<div className="font-mono text-xs text-accent border-l-2 border-accent pl-3 py-1">
					{error}
				</div>
			)}
			<OutputBlock
				value={output}
				placeholder="matched value"
				copyLabel="Copy"
			/>
		</ToolShell>
	);
}
