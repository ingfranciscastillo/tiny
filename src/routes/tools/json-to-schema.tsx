import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";

import ToolShell, { OutputBlock, WorkSurface } from "#/components/ToolShell";
import { toolHead } from "#/lib/seo";

export const Route = createFileRoute("/tools/json-to-schema")({
	head: () => toolHead("json-to-schema"),
	component: JsonToSchema,
});

// biome-ignore-start lint/suspicious/noExplicitAny: inferring a schema from arbitrary parsed JSON
function infer(val: any): Record<string, any> {
	if (val === null) return { type: "null" };
	if (Array.isArray(val))
		return { type: "array", items: val.length > 0 ? infer(val[0]) : {} };
	const t = typeof val;
	if (t === "object") {
		const props: Record<string, any> = {};
		for (const k of Object.keys(val)) props[k] = infer(val[k]);
		return { type: "object", properties: props, required: Object.keys(val) };
	}
	return { type: t };
}

function schema(val: any): Record<string, any> {
	const s: Record<string, any> = {
		$schema: "http://json-schema.org/draft-07/schema#",
	};
	if (Array.isArray(val)) {
		s.type = "array";
		s.items = val.length > 0 ? infer(val[0]) : {};
	} else {
		Object.assign(s, infer(val));
	}
	return s;
}
// biome-ignore-end lint/suspicious/noExplicitAny: inferring a schema from arbitrary parsed JSON

function JsonToSchema() {
	const [input, setInput] = useState("");
	const { output, error } = useMemo(() => {
		if (!input.trim()) return { output: "", error: null };
		try {
			return {
				output: JSON.stringify(schema(JSON.parse(input)), null, 2),
				error: null,
			};
		} catch {
			return { output: "", error: "invalid JSON" };
		}
	}, [input]);

	return (
		<ToolShell
			toolId="json-to-schema"
			title="JSON → Schema"
			description="Generate JSON Schema"
			runsLocally
		>
			<WorkSurface
				label="json"
				value={input}
				onChange={(e) => setInput(e.target.value)}
				placeholder='{"name":"John","age":30}'
				rows={6}
			/>
			{error && (
				<div className="font-mono text-xs text-accent border-l-2 border-accent pl-3 py-1">
					{error}
				</div>
			)}
			<OutputBlock
				value={output}
				placeholder='{"$schema":"...","type":"object"}'
				copyLabel="Copy"
				downloadName="schema.json"
			/>
		</ToolShell>
	);
}
