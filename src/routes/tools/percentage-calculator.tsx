import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";

import ToolShell from "#/components/ToolShell";
import { toolHead } from "#/lib/seo";

export const Route = createFileRoute("/tools/percentage-calculator")({
	head: () => toolHead("percentage"),
	component: PercentageCalculator,
});

type Mode = "of" | "is";

const MODES: [Mode, string][] = [
	["of", "X% of Y"],
	["is", "X is what % of Y"],
];

function PercentageCalculator() {
	const [mode, setMode] = useState<Mode>("of");
	const [a, setA] = useState("25");
	const [b, setB] = useState("200");
	const result = useMemo(() => {
		const x = Number.parseFloat(a);
		const y = Number.parseFloat(b);
		if (Number.isNaN(x) || Number.isNaN(y)) return null;
		if (mode === "of") return (x / 100) * y;
		return (x / y) * 100;
	}, [mode, a, b]);

	return (
		<ToolShell
			toolId="percentage"
			title="Percentage Calculator"
			description="Calculate percentages"
			runsLocally
		>
			<div className="flex items-center gap-1">
				{MODES.map(([m, l]) => (
					<button
						key={m}
						type="button"
						onClick={() => setMode(m)}
						className={`font-mono text-xs uppercase tracking-wide px-3 py-1.5 border border-rule transition-tiny ${
							mode === m ? "bg-accent-soft text-accent" : "hover:text-accent"
						}`}
					>
						{l}
					</button>
				))}
			</div>
			<div className="grid grid-cols-2 gap-3">
				<div>
					<label
						htmlFor="pct-a"
						className="font-mono text-[11px] uppercase tracking-wide text-muted block mb-1.5"
					>
						{mode === "of" ? "percentage" : "value"}
					</label>
					<input
						id="pct-a"
						value={a}
						onChange={(e) => setA(e.target.value)}
						type="number"
						step="any"
						className="w-full font-mono text-sm bg-surface border border-rule rounded-none px-3 py-2 focus:outline-none focus:border-accent transition-tiny"
					/>
				</div>
				<div>
					<label
						htmlFor="pct-b"
						className="font-mono text-[11px] uppercase tracking-wide text-muted block mb-1.5"
					>
						{mode === "of" ? "of value" : "of total"}
					</label>
					<input
						id="pct-b"
						value={b}
						onChange={(e) => setB(e.target.value)}
						type="number"
						step="any"
						className="w-full font-mono text-sm bg-surface border border-rule rounded-none px-3 py-2 focus:outline-none focus:border-accent transition-tiny"
					/>
				</div>
			</div>
			{result != null && (
				<div className="border border-rule bg-surface px-3.5 py-3 flex items-center justify-between">
					<span className="font-mono text-sm text-muted">result</span>
					<span className="font-mono text-2xl">
						{mode === "of" ? result : `${result.toFixed(2)}%`}
					</span>
				</div>
			)}
		</ToolShell>
	);
}
