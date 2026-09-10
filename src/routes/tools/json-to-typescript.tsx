import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";

import ToolShell, { OutputBlock, WorkSurface } from "#/components/ToolShell";
import { toolHead } from "#/lib/seo";

export const Route = createFileRoute("/tools/json-to-typescript")({
	head: () => toolHead("json-to-typescript"),
	component: JsonToTypescript,
});

function capitalize(s: string): string {
	return s.charAt(0).toUpperCase() + s.slice(1);
}

// biome-ignore-start lint/suspicious/noExplicitAny: generating TS types from arbitrary parsed JSON
function inferType(v: any): string {
	if (v === null) return "null";
	if (Array.isArray(v)) return "any[]";
	return typeof v;
}

function toTsInterface(obj: any, name: string): string {
	const keys = Object.keys(obj);
	const lines = keys.map((k) => {
		const v = obj[k];
		let type = "any";
		if (v === null) type = "null";
		else if (Array.isArray(v))
			type = v.length > 0 ? `${inferType(v[0])}[]` : "any[]";
		else if (typeof v === "object") type = name + capitalize(k);
		else type = typeof v;
		return `  ${k}: ${type};`;
	});
	return `interface ${name} {\n${lines.join("\n")}\n}`;
}

function toTs(obj: any, name = "Root"): string {
	if (obj === null) return "null";
	if (Array.isArray(obj)) {
		if (obj.length === 0) return `${name}[];`;
		return `${name}[];\n\n${toTsInterface(obj[0], `${name}Item`)}`;
	}
	return toTsInterface(obj, name);
}
// biome-ignore-end lint/suspicious/noExplicitAny: generating TS types from arbitrary parsed JSON

function JsonToTypescript() {
	const [input, setInput] = useState("");
	const [name, setName] = useState("Root");
	const { output, error } = useMemo(() => {
		if (!input.trim()) return { output: "", error: null };
		try {
			return { output: toTs(JSON.parse(input), name), error: null };
		} catch {
			return { output: "", error: "invalid JSON" };
		}
	}, [input, name]);

	return (
		<ToolShell
			toolId="json-to-typescript"
			title="JSON → TypeScript"
			description="Generate TypeScript types"
			runsLocally
		>
			<div className="flex items-end gap-3">
				<div>
					<label
						htmlFor="ts-root-name"
						className="font-mono text-[11px] uppercase tracking-wide text-muted block mb-1.5"
					>
						root name
					</label>
					<input
						id="ts-root-name"
						value={name}
						onChange={(e) => setName(e.target.value)}
						spellCheck={false}
						className="w-32 font-mono text-sm bg-surface border border-rule rounded-none px-3 py-2 focus:outline-none focus:border-accent transition-tiny"
					/>
				</div>
			</div>
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
				placeholder="interface Root { ... }"
				copyLabel="Copy"
				downloadName="types.ts"
			/>
		</ToolShell>
	);
}
