import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";

import ToolShell, { OutputBlock, WorkSurface } from "#/components/ToolShell";
import { toolHead } from "#/lib/seo";

export const Route = createFileRoute("/tools/markdown-to-plain")({
	head: () => toolHead("markdown-to-plain"),
	component: MarkdownToPlain,
});

function MarkdownToPlain() {
	const [input, setInput] = useState("");
	const output = useMemo(() => {
		if (!input) return "";
		return input
			.replace(/```[\s\S]*?```/g, (m) =>
				m.replace(/```\w*\n?/g, "").replace(/```/g, ""),
			)
			.replace(/`([^`]+)`/g, "$1")
			.replace(/^#{1,6}\s+/gm, "")
			.replace(/\*\*([^*]+)\*\*/g, "$1")
			.replace(/\*([^*]+)\*/g, "$1")
			.replace(/__([^_]+)__/g, "$1")
			.replace(/_([^_]+)_/g, "$1")
			.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
			.replace(/!\[([^\]]*)\]\([^)]+\)/g, "$1")
			.replace(/^\s*[-*+]\s+/gm, "• ")
			.replace(/^\s*\d+\.\s+/gm, "")
			.replace(/^\s*>\s+/gm, "")
			.replace(/^---+$/gm, "")
			.replace(/\|/g, " ")
			.replace(/\n{3,}/g, "\n\n")
			.trim();
	}, [input]);

	return (
		<ToolShell
			toolId="markdown-to-plain"
			title="Markdown → Plain Text"
			description="Strip Markdown formatting"
			runsLocally
		>
			<WorkSurface
				label="markdown"
				value={input}
				onChange={(e) => setInput(e.target.value)}
				placeholder="# Title&#10;**bold** and *italic*"
				rows={8}
			/>
			<OutputBlock value={output} placeholder="plain text" copyLabel="Copy" />
		</ToolShell>
	);
}
