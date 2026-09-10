import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";

import ToolShell, { OutputBlock, WorkSurface } from "#/components/ToolShell";
import { toolHead } from "#/lib/seo";

export const Route = createFileRoute("/tools/svg-optimizer")({
	head: () => toolHead("svg-optimizer"),
	component: SvgOptimizer,
});

interface OptimizeResult {
	out: string;
	saved: number;
}

function SvgOptimizer() {
	const [input, setInput] = useState("");
	const output = useMemo<OptimizeResult>(() => {
		if (!input.trim()) return { out: "", saved: 0 };
		const out = input
			.replace(/<!--[\s\S]*?-->/g, "")
			.replace(/\s+/g, " ")
			.replace(/>\s+</g, "><")
			.replace(/\s*([{};:,>])\s*/g, "$1")
			.trim();
		return { out, saved: input.length - out.length };
	}, [input]);

	return (
		<ToolShell
			toolId="svg-optimizer"
			title="SVG Optimizer"
			description="Clean and minify SVG"
			runsLocally
		>
			<WorkSurface
				label="svg"
				value={input}
				onChange={(e) => setInput(e.target.value)}
				placeholder="<svg>...</svg>"
				rows={8}
			/>
			{input && (
				<div className="font-mono text-xs text-muted">
					{output.saved} bytes saved (
					{Math.round((output.saved / input.length) * 100) || 0}%)
				</div>
			)}
			<OutputBlock
				value={output.out}
				placeholder="optimized svg"
				copyLabel="Copy"
				downloadName="optimized.svg"
			/>
		</ToolShell>
	);
}
