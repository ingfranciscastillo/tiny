import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";

import CopyButton from "#/components/CopyButton";
import ToolShell from "#/components/ToolShell";
import { toolHead } from "#/lib/seo";

export const Route = createFileRoute("/tools/scientific-notation")({
	head: () => toolHead("scientific-notation"),
	component: ScientificNotation,
});

interface Results {
	sci: string;
	fixed: string;
	exp: string;
}

function ScientificNotation() {
	const [input, setInput] = useState("1234567");
	const results = useMemo<Results | null>(() => {
		const n = Number.parseFloat(input);
		if (Number.isNaN(n)) return null;
		return {
			sci: n.toExponential(),
			fixed: n.toFixed(6).replace(/\.?0+$/, ""),
			exp: n.toExponential(2),
		};
	}, [input]);

	return (
		<ToolShell
			toolId="scientific-notation"
			title="Scientific Notation"
			description="Convert notation"
			runsLocally
		>
			<div>
				<label
					htmlFor="sci-notation-input"
					className="font-mono text-[11px] uppercase tracking-wide text-muted block mb-1.5"
				>
					number
				</label>
				<input
					id="sci-notation-input"
					value={input}
					onChange={(e) => setInput(e.target.value)}
					type="number"
					step="any"
					className="w-full font-mono text-sm bg-surface border border-rule rounded-none px-3.5 py-3 focus:outline-none focus:border-accent transition-tiny"
				/>
			</div>
			{results && (
				<div className="border border-rule bg-surface divide-y divide-border">
					{(
						[
							["scientific", results.sci],
							["exponential (2)", results.exp],
							["fixed", results.fixed],
						] as const
					).map(([k, v]) => (
						<div
							key={k}
							className="flex items-center justify-between px-3.5 py-2.5"
						>
							<span className="font-mono text-[10px] uppercase tracking-wide text-muted w-28">
								{k}
							</span>
							<span className="font-mono text-sm flex-1">{v}</span>
							<CopyButton value={v} label="copy" />
						</div>
					))}
				</div>
			)}
		</ToolShell>
	);
}
