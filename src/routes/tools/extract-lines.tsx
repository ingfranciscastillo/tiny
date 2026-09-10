import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";

import ToolShell, { OutputBlock, WorkSurface } from "#/components/ToolShell";
import { toolHead } from "#/lib/seo";

export const Route = createFileRoute("/tools/extract-lines")({
	head: () => toolHead("extract-lines"),
	component: ExtractLines,
});

function ExtractLines() {
	const [input, setInput] = useState("");
	const [pattern, setPattern] = useState("");
	const [useRegex, setUseRegex] = useState(false);
	const [invert, setInvert] = useState(false);

	const output = useMemo(() => {
		if (!input || !pattern) return input;
		try {
			const re = useRegex
				? new RegExp(pattern)
				: new RegExp(pattern.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
			return input
				.split("\n")
				.filter((l) => (invert ? !re.test(l) : re.test(l)))
				.join("\n");
		} catch {
			return input;
		}
	}, [input, pattern, useRegex, invert]);

	return (
		<ToolShell
			toolId="extract-lines"
			title="Extract Lines"
			description="Keep lines matching a pattern"
			runsLocally
		>
			<div className="flex items-center gap-3">
				<input
					value={pattern}
					onChange={(e) => setPattern(e.target.value)}
					placeholder="pattern"
					spellCheck={false}
					className="flex-1 font-mono text-sm bg-surface border border-rule rounded-none px-3 py-2 focus:outline-none focus:border-accent transition-tiny"
				/>
				<label className="flex items-center gap-1.5 font-mono text-xs text-muted cursor-pointer">
					<input
						type="checkbox"
						checked={useRegex}
						onChange={(e) => setUseRegex(e.target.checked)}
						className="accent-accent"
					/>{" "}
					regex
				</label>
				<label className="flex items-center gap-1.5 font-mono text-xs text-muted cursor-pointer">
					<input
						type="checkbox"
						checked={invert}
						onChange={(e) => setInvert(e.target.checked)}
						className="accent-accent"
					/>{" "}
					invert
				</label>
			</div>
			<WorkSurface
				label="input"
				value={input}
				onChange={(e) => setInput(e.target.value)}
				placeholder="lines to filter"
				rows={6}
			/>
			<OutputBlock
				value={output}
				placeholder="matching lines"
				copyLabel="Copy"
			/>
		</ToolShell>
	);
}
