import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";

import ToolShell, { OutputBlock, WorkSurface } from "#/components/ToolShell";
import { toolHead } from "#/lib/seo";

export const Route = createFileRoute("/tools/css-formatter")({
	head: () => toolHead("css-formatter"),
	component: CssFormatter,
});

function formatCss(css: string): string {
	return css
		.replace(/\/\*[\s\S]*?\*\//g, "")
		.replace(/\s*{\s*/g, " {\n  ")
		.replace(/;\s*/g, ";\n  ")
		.replace(/\s*}\s*/g, "\n}\n\n")
		.replace(/\n {2}\n/g, "\n")
		.replace(/\n{2,}/g, "\n\n")
		.replace(/^\s+/gm, (m) => m.replace(/\t/g, "  "))
		.trim();
}

function CssFormatter() {
	const [input, setInput] = useState("");
	const output = useMemo(() => (input.trim() ? formatCss(input) : ""), [input]);
	return (
		<ToolShell
			toolId="css-formatter"
			title="CSS Formatter"
			description="Format CSS"
			runsLocally
		>
			<WorkSurface
				label="css"
				value={input}
				onChange={(e) => setInput(e.target.value)}
				placeholder=".a{color:red;margin:0}"
				rows={6}
			/>
			<OutputBlock
				value={output}
				placeholder="formatted CSS"
				copyLabel="Copy"
				downloadName="style.css"
			/>
		</ToolShell>
	);
}
