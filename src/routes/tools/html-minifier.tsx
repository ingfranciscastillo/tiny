import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";

import ToolShell, { OutputBlock, WorkSurface } from "#/components/ToolShell";
import { toolHead } from "#/lib/seo";

export const Route = createFileRoute("/tools/html-minifier")({
	head: () => toolHead("html-minifier"),
	component: HtmlMinifier,
});

function HtmlMinifier() {
	const [input, setInput] = useState("");
	const output = useMemo(() => {
		if (!input.trim()) return "";
		return input
			.replace(/<!--[\s\S]*?-->/g, "")
			.replace(/\s+/g, " ")
			.replace(/>\s+</g, "><")
			.trim();
	}, [input]);
	return (
		<ToolShell
			toolId="html-minifier"
			title="HTML Minifier"
			description="Minify HTML"
			runsLocally
		>
			<WorkSurface
				label="html"
				value={input}
				onChange={(e) => setInput(e.target.value)}
				placeholder="<div>  hi  </div>"
				rows={6}
			/>
			<OutputBlock
				value={output}
				placeholder="<div>hi</div>"
				copyLabel="Copy"
			/>
		</ToolShell>
	);
}
