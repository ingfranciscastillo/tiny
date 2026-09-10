import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";

import ToolShell from "#/components/ToolShell";
import { toolHead } from "#/lib/seo";

export const Route = createFileRoute("/tools/ratio-calculator")({
	head: () => toolHead("ratio"),
	component: RatioCalculator,
});

function gcd(a: number, b: number): number {
	return b === 0 ? a : gcd(b, a % b);
}

function RatioCalculator() {
	const [a, setA] = useState("8");
	const [b, setB] = useState("12");
	const result = useMemo(() => {
		const x = Number.parseInt(a, 10);
		const y = Number.parseInt(b, 10);
		if (!x || !y) return null;
		const g = gcd(Math.abs(x), Math.abs(y));
		return `${x / g} : ${y / g}`;
	}, [a, b]);

	return (
		<ToolShell
			toolId="ratio"
			title="Ratio Calculator"
			description="Simplify ratios"
			runsLocally
		>
			<div className="grid grid-cols-2 gap-3">
				<div>
					<label
						htmlFor="ratio-a"
						className="font-mono text-[11px] uppercase tracking-wide text-muted block mb-1.5"
					>
						a
					</label>
					<input
						id="ratio-a"
						value={a}
						onChange={(e) => setA(e.target.value)}
						type="number"
						className="w-full font-mono text-sm bg-surface border border-rule rounded-none px-3 py-2 focus:outline-none focus:border-accent transition-tiny"
					/>
				</div>
				<div>
					<label
						htmlFor="ratio-b"
						className="font-mono text-[11px] uppercase tracking-wide text-muted block mb-1.5"
					>
						b
					</label>
					<input
						id="ratio-b"
						value={b}
						onChange={(e) => setB(e.target.value)}
						type="number"
						className="w-full font-mono text-sm bg-surface border border-rule rounded-none px-3 py-2 focus:outline-none focus:border-accent transition-tiny"
					/>
				</div>
			</div>
			{result && (
				<div className="border border-rule bg-surface px-3.5 py-3 flex items-center justify-between">
					<span className="font-mono text-sm text-muted">simplified</span>
					<span className="font-mono text-2xl">{result}</span>
				</div>
			)}
		</ToolShell>
	);
}
