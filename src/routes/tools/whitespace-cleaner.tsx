import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";

import ToolShell, { OutputBlock, WorkSurface } from "#/components/ToolShell";
import { toolHead } from "#/lib/seo";

export const Route = createFileRoute("/tools/whitespace-cleaner")({
	head: () => toolHead("whitespace-cleaner"),
	component: WhitespaceCleaner,
});

function WhitespaceCleaner() {
	const [input, setInput] = useState("");
	const [collapseSpaces, setCollapseSpaces] = useState(true);
	const [trimLines, setTrimLines] = useState(true);
	const [removeBlank, setRemoveBlank] = useState(false);
	const output = useMemo(() => {
		if (!input) return "";
		let out = input;
		if (collapseSpaces) out = out.replace(/[ \t]+/g, " ");
		if (trimLines)
			out = out
				.split("\n")
				.map((l) => l.replace(/^\s+|\s+$/g, ""))
				.join("\n");
		if (removeBlank)
			out = out
				.split("\n")
				.filter((l) => l.length > 0)
				.join("\n");
		return out.replace(/\n{3,}/g, "\n\n");
	}, [input, collapseSpaces, trimLines, removeBlank]);

	return (
		<ToolShell
			toolId="whitespace-cleaner"
			title="Whitespace Cleaner"
			description="Normalize spaces and line breaks"
			runsLocally
		>
			<div className="flex flex-wrap items-center gap-4">
				<label className="flex items-center gap-1.5 font-mono text-xs text-muted cursor-pointer">
					<input
						type="checkbox"
						checked={collapseSpaces}
						onChange={(e) => setCollapseSpaces(e.target.checked)}
						className="accent-accent"
					/>{" "}
					collapse spaces
				</label>
				<label className="flex items-center gap-1.5 font-mono text-xs text-muted cursor-pointer">
					<input
						type="checkbox"
						checked={trimLines}
						onChange={(e) => setTrimLines(e.target.checked)}
						className="accent-accent"
					/>{" "}
					trim lines
				</label>
				<label className="flex items-center gap-1.5 font-mono text-xs text-muted cursor-pointer">
					<input
						type="checkbox"
						checked={removeBlank}
						onChange={(e) => setRemoveBlank(e.target.checked)}
						className="accent-accent"
					/>{" "}
					remove blank lines
				</label>
			</div>
			<WorkSurface
				label="input"
				value={input}
				onChange={(e) => setInput(e.target.value)}
				placeholder="  messy   text  "
				rows={6}
			/>
			<OutputBlock value={output} placeholder="cleaned text" copyLabel="Copy" />
		</ToolShell>
	);
}
