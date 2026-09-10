import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";

import ToolShell, { OutputBlock, WorkSurface } from "#/components/ToolShell";
import { toolHead } from "#/lib/seo";

export const Route = createFileRoute("/tools/yaml-to-json")({
	head: () => toolHead("yaml-to-json"),
	component: YamlToJson,
});

// biome-ignore-start lint/suspicious/noExplicitAny: building an arbitrary nested tree from ad-hoc indentation-based YAML
function parseScalar(v: string): any {
	if (v === "null" || v === "~") return null;
	if (v === "true") return true;
	if (v === "false") return false;
	if (v.startsWith('"') && v.endsWith('"')) return v.slice(1, -1);
	if (/^-?\d+$/.test(v)) return Number.parseInt(v, 10);
	if (/^-?\d+\.\d+$/.test(v)) return Number.parseFloat(v);
	return v;
}

interface StackFrame {
	indent: number;
	value: any;
	key: string | null;
	isArray: boolean;
}

function parseYaml(text: string): any {
	const lines = text
		.split("\n")
		.filter((l) => l.trim() && !l.trim().startsWith("#"));
	let root: any = null;
	const stack: StackFrame[] = [
		{ indent: -1, value: null, key: null, isArray: false },
	];
	for (const raw of lines) {
		const indent = raw.length - raw.trimStart().length;
		const line = raw.trim();
		while (stack.length > 1 && stack[stack.length - 1].indent >= indent)
			stack.pop();
		const parent = stack[stack.length - 1];
		if (line.startsWith("- ")) {
			if (parent.isArray === false) {
				parent.isArray = true;
				parent.value = [];
			}
			if (!parent.value) parent.value = [];
			const item = line.slice(2);
			if (item.includes(": ")) {
				const obj: Record<string, any> = {};
				parent.value.push(obj);
				const [k, v] = item.split(": ", 2);
				obj[k] = parseScalar(v);
				stack.push({ indent: indent + 2, value: obj, key: k, isArray: false });
			} else {
				parent.value.push(parseScalar(item));
			}
		} else if (line.includes(": ")) {
			const [k, v] = line.split(": ", 2);
			if (root === null) {
				root = {};
				stack[0].value = root;
			}
			if (v === "") {
				const obj: Record<string, any> = {};
				parent.value[k] = obj;
				stack.push({ indent: indent + 2, value: obj, key: k, isArray: false });
			} else {
				parent.value[k] = parseScalar(v);
			}
		} else if (line.endsWith(":")) {
			const k = line.slice(0, -1);
			if (root === null) {
				root = {};
				stack[0].value = root;
			}
			const obj: Record<string, any> = {};
			parent.value[k] = obj;
			stack.push({ indent: indent + 2, value: obj, key: k, isArray: false });
		}
	}
	return root;
}
// biome-ignore-end lint/suspicious/noExplicitAny: building an arbitrary nested tree from ad-hoc indentation-based YAML

function YamlToJson() {
	const [input, setInput] = useState("");
	const { output, error } = useMemo(() => {
		if (!input.trim()) return { output: "", error: null };
		try {
			const r = parseYaml(input);
			return { output: JSON.stringify(r, null, 2), error: null };
		} catch {
			return { output: "", error: "could not parse YAML" };
		}
	}, [input]);

	return (
		<ToolShell
			toolId="yaml-to-json"
			title="YAML → JSON"
			description="Convert YAML to JSON"
			runsLocally
		>
			<WorkSurface
				label="yaml"
				value={input}
				onChange={(e) => setInput(e.target.value)}
				placeholder={"key: value\nlist:\n  - item"}
				rows={8}
			/>
			{error && (
				<div className="font-mono text-xs text-accent border-l-2 border-accent pl-3 py-1">
					{error}
				</div>
			)}
			<OutputBlock
				value={output}
				placeholder='{"key":"value"}'
				copyLabel="Copy"
				downloadName="converted.json"
			/>
		</ToolShell>
	);
}
