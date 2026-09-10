import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";

import ToolShell, { OutputBlock, WorkSurface } from "#/components/ToolShell";
import { toolHead } from "#/lib/seo";

export const Route = createFileRoute("/tools/js-formatter")({
	head: () => toolHead("js-formatter"),
	component: JsFormatter,
});

function formatJs(code: string): string {
	let indent = 0;
	let out = "";
	let i = 0;
	let inStr: string | null = null;
	while (i < code.length) {
		const c = code[i];
		if (inStr) {
			out += c;
			if (c === inStr && code[i - 1] !== "\\") inStr = null;
			i++;
			continue;
		}
		if (c === '"' || c === "'" || c === "`") {
			inStr = c;
			out += c;
			i++;
			continue;
		}
		if (c === "{") {
			out += ` {\n${"  ".repeat(indent + 1)}`;
			indent++;
			i++;
			continue;
		}
		if (c === "}") {
			indent = Math.max(0, indent - 1);
			out = out.replace(/\s+$/, "");
			out += `\n${"  ".repeat(indent)}}`;
			i++;
			continue;
		}
		if (c === ";") {
			out += `;\n${"  ".repeat(indent)}`;
			i++;
			continue;
		}
		out += c;
		i++;
	}
	return out.replace(/\n\s*\n/g, "\n").trim();
}

function JsFormatter() {
	const [input, setInput] = useState("");
	const output = useMemo(() => (input.trim() ? formatJs(input) : ""), [input]);
	return (
		<ToolShell
			toolId="js-formatter"
			title="JS Formatter"
			description="Format JavaScript"
			runsLocally
		>
			<WorkSurface
				label="javascript"
				value={input}
				onChange={(e) => setInput(e.target.value)}
				placeholder="const f=()=>{return 1;}"
				rows={6}
			/>
			<OutputBlock
				value={output}
				placeholder="formatted JS"
				copyLabel="Copy"
				downloadName="script.js"
			/>
		</ToolShell>
	);
}
