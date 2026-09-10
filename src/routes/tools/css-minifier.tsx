import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";

import ToolShell, { OutputBlock, WorkSurface } from "#/components/ToolShell";
import { toolHead } from "#/lib/seo";

export const Route = createFileRoute("/tools/css-minifier")({
	head: () => toolHead("css-minifier"),
	component: CssMinifier,
});

function CssMinifier() {
	const [input, setInput] = useState("");
	const output = useMemo(() => {
		if (!input.trim()) return "";
		return input
			.replace(/\/\*[\s\S]*?\*\//g, "")
			.replace(/\s+/g, " ")
			.replace(/\s*([{}:;,])\s*/g, "$1")
			.replace(/;}/g, "}")
			.trim();
	}, [input]);
	return (
		<ToolShell
			toolId="css-minifier"
			title="CSS Minifier"
			description="Minify CSS"
			runsLocally
		>
			<WorkSurface
				label="css"
				value={input}
				onChange={(e) => setInput(e.target.value)}
				placeholder=".a { color: red; }"
				rows={6}
			/>
			<OutputBlock
				value={output}
				placeholder=".a{color:red}"
				copyLabel="Copy"
			/>
		</ToolShell>
	);
}
