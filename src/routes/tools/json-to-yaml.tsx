import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";

import ToolShell, { OutputBlock, WorkSurface } from "#/components/ToolShell";
import { toolHead } from "#/lib/seo";

export const Route = createFileRoute("/tools/json-to-yaml")({
	head: () => toolHead("json-to-yaml"),
	component: JsonToYaml,
});

// biome-ignore lint/suspicious/noExplicitAny: converting an arbitrary parsed JSON value
function toYaml(obj: any, indent = 0): string {
	const pad = "  ".repeat(indent);
	if (obj === null) return "null";
	if (typeof obj !== "object") return String(obj);
	if (Array.isArray(obj)) {
		if (obj.length === 0) return "[]";
		return obj
			.map((v) => {
				if (v !== null && typeof v === "object")
					return `${pad}- ${toYaml(v, indent + 1).replace(/^ {2}/, "")}`;
				return `${pad}- ${String(v)}`;
			})
			.join("\n");
	}
	const keys = Object.keys(obj);
	if (keys.length === 0) return "{}";
	return keys
		.map((k) => {
			const v = obj[k];
			if (v !== null && typeof v === "object") {
				const inner = toYaml(v, indent + 1);
				if (Array.isArray(v) && v.length === 0) return `${pad}${k}: []`;
				if (!Array.isArray(v) && Object.keys(v).length === 0)
					return `${pad}${k}: {}`;
				return `${pad}${k}:\n${inner}`;
			}
			return `${pad}${k}: ${v === null ? "null" : String(v)}`;
		})
		.join("\n");
}

function JsonToYaml() {
	const [input, setInput] = useState("");
	const { output, error } = useMemo(() => {
		if (!input.trim()) return { output: "", error: null };
		try {
			return { output: toYaml(JSON.parse(input)), error: null };
		} catch {
			return { output: "", error: "invalid JSON" };
		}
	}, [input]);

	return (
		<ToolShell
			toolId="json-to-yaml"
			title="JSON → YAML"
			description="Convert JSON to YAML"
			runsLocally
		>
			<WorkSurface
				label="json"
				value={input}
				onChange={(e) => setInput(e.target.value)}
				placeholder='{"key":"value"}'
				rows={8}
			/>
			{error && (
				<div className="font-mono text-xs text-accent border-l-2 border-accent pl-3 py-1">
					{error}
				</div>
			)}
			<OutputBlock
				value={output}
				placeholder="yaml output"
				copyLabel="Copy"
				downloadName="converted.yaml"
			/>
		</ToolShell>
	);
}
