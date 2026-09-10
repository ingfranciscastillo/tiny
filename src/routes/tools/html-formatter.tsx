import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";

import ToolShell, { OutputBlock, WorkSurface } from "#/components/ToolShell";
import { toolHead } from "#/lib/seo";

export const Route = createFileRoute("/tools/html-formatter")({
	head: () => toolHead("html-formatter"),
	component: HtmlFormatter,
});

const VOID_TAGS = new Set([
	"area",
	"base",
	"br",
	"col",
	"embed",
	"hr",
	"img",
	"input",
	"link",
	"meta",
	"param",
	"source",
	"track",
	"wbr",
]);

function formatHtml(html: string): string {
	const tokens = html
		.replace(/>\s*</g, "><")
		.replace(/\s+/g, " ")
		.trim()
		.split(/(<[^>]+>)/)
		.filter(Boolean);
	let indent = 0;
	const lines: string[] = [];
	for (const t of tokens) {
		if (t.startsWith("</")) {
			indent = Math.max(0, indent - 1);
			lines.push("  ".repeat(indent) + t);
		} else if (t.startsWith("<") && !t.endsWith("/>") && !t.startsWith("<!")) {
			const tag = t.match(/^<(\w+)/)?.[1] || "";
			lines.push("  ".repeat(indent) + t);
			if (!VOID_TAGS.has(tag)) indent++;
		} else if (t.startsWith("<")) {
			lines.push("  ".repeat(indent) + t);
		} else if (t.trim()) {
			lines.push("  ".repeat(indent) + t.trim());
		}
	}
	return lines.join("\n");
}

function HtmlFormatter() {
	const [input, setInput] = useState("");
	const output = useMemo(
		() => (input.trim() ? formatHtml(input) : ""),
		[input],
	);
	return (
		<ToolShell
			toolId="html-formatter"
			title="HTML Formatter"
			description="Format HTML"
			runsLocally
		>
			<WorkSurface
				label="html"
				value={input}
				onChange={(e) => setInput(e.target.value)}
				placeholder="<div><p>hi</p></div>"
				rows={6}
			/>
			<OutputBlock
				value={output}
				placeholder="formatted HTML"
				copyLabel="Copy"
				downloadName="page.html"
			/>
		</ToolShell>
	);
}
