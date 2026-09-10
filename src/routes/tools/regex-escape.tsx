import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";

import ToolShell, { OutputBlock, WorkSurface } from "#/components/ToolShell";
import { toolHead } from "#/lib/seo";

export const Route = createFileRoute("/tools/regex-escape")({
	head: () => toolHead("regex-escape"),
	component: RegexEscape,
});

function RegexEscape() {
	const [input, setInput] = useState("");
	const output = useMemo(
		() => input.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
		[input],
	);
	return (
		<ToolShell
			toolId="regex-escape"
			title="Regex Escape"
			description="Escape regex special characters"
			runsLocally
		>
			<WorkSurface
				label="input"
				value={input}
				onChange={(e) => setInput(e.target.value)}
				placeholder="price: $50 (new)"
				rows={4}
			/>
			<OutputBlock
				value={output}
				placeholder="price:\\ \\$50 \\(new\\)"
				copyLabel="Copy"
			/>
		</ToolShell>
	);
}
