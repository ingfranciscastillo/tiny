import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";

import ToolShell, { OutputBlock, WorkSurface } from "#/components/ToolShell";
import { toolHead } from "#/lib/seo";

export const Route = createFileRoute("/tools/js-minifier")({
	head: () => toolHead("js-minifier"),
	component: JsMinifier,
});

function minifyJs(out: string): string {
	let inStr: string | null = null;
	let result = "";
	for (let i = 0; i < out.length; i++) {
		const c = out[i];
		if (inStr) {
			result += c;
			if (c === inStr && out[i - 1] !== "\\") inStr = null;
			continue;
		}
		if (c === '"' || c === "'" || c === "`") {
			inStr = c;
			result += c;
			continue;
		}
		if (c === "/" && out[i + 1] === "/") {
			while (i < out.length && out[i] !== "\n") i++;
			continue;
		}
		if (c === "/" && out[i + 1] === "*") {
			i += 2;
			while (i < out.length && !(out[i] === "*" && out[i + 1] === "/")) i++;
			i++;
			continue;
		}
		if (/\s/.test(c)) {
			if (
				result &&
				/\w/.test(result[result.length - 1]) &&
				/\w/.test(out[i + 1] || "")
			)
				result += " ";
			continue;
		}
		result += c;
	}
	return result;
}

function JsMinifier() {
	const [input, setInput] = useState("");
	const output = useMemo(() => (input.trim() ? minifyJs(input) : ""), [input]);
	return (
		<ToolShell
			toolId="js-minifier"
			title="JS Minifier"
			description="Minify JavaScript"
			runsLocally
		>
			<WorkSurface
				label="javascript"
				value={input}
				onChange={(e) => setInput(e.target.value)}
				placeholder="const x = 1;"
				rows={6}
			/>
			<OutputBlock value={output} placeholder="const x=1;" copyLabel="Copy" />
		</ToolShell>
	);
}
