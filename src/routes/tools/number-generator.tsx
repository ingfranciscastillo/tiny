import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import ToolShell, { OutputBlock } from "#/components/ToolShell";
import { toolHead } from "#/lib/seo";

export const Route = createFileRoute("/tools/number-generator")({
	head: () => toolHead("number-generator"),
	component: NumberGenerator,
});

function NumberGenerator() {
	const [min, setMin] = useState("1");
	const [max, setMax] = useState("1000");
	const [count, setCount] = useState("10");
	const [output, setOutput] = useState("");

	const generate = () => {
		const lo = Number.parseInt(min, 10);
		const hi = Number.parseInt(max, 10);
		const n = Math.min(100, Number.parseInt(count, 10) || 1);
		if (Number.isNaN(lo) || Number.isNaN(hi) || lo > hi) {
			setOutput("invalid range");
			return;
		}
		const arr = Array.from(
			{ length: n },
			() => lo + Math.floor(Math.random() * (hi - lo + 1)),
		);
		setOutput(arr.join("\n"));
	};

	return (
		<ToolShell
			toolId="number-generator"
			title="Number Generator"
			description="Generate random numbers"
			runsLocally
		>
			<div className="grid grid-cols-3 gap-3">
				<div>
					<label
						htmlFor="number-gen-min"
						className="font-mono text-[11px] uppercase tracking-wide text-muted block mb-1.5"
					>
						min
					</label>
					<input
						id="number-gen-min"
						value={min}
						onChange={(e) => setMin(e.target.value)}
						type="number"
						className="w-full font-mono text-sm bg-surface border border-rule rounded-none px-3 py-2 focus:outline-none focus:border-accent transition-tiny"
					/>
				</div>
				<div>
					<label
						htmlFor="number-gen-max"
						className="font-mono text-[11px] uppercase tracking-wide text-muted block mb-1.5"
					>
						max
					</label>
					<input
						id="number-gen-max"
						value={max}
						onChange={(e) => setMax(e.target.value)}
						type="number"
						className="w-full font-mono text-sm bg-surface border border-rule rounded-none px-3 py-2 focus:outline-none focus:border-accent transition-tiny"
					/>
				</div>
				<div>
					<label
						htmlFor="number-gen-count"
						className="font-mono text-[11px] uppercase tracking-wide text-muted block mb-1.5"
					>
						count
					</label>
					<input
						id="number-gen-count"
						value={count}
						onChange={(e) => setCount(e.target.value)}
						type="number"
						className="w-full font-mono text-sm bg-surface border border-rule rounded-none px-3 py-2 focus:outline-none focus:border-accent transition-tiny"
					/>
				</div>
			</div>
			<button
				type="button"
				onClick={generate}
				className="font-mono text-xs uppercase tracking-wide px-3 py-1.5 border border-rule rounded-none transition-tiny hover:text-accent hover:border-accent"
			>
				Generate
			</button>
			<OutputBlock
				value={output}
				placeholder="random numbers"
				copyLabel="Copy"
			/>
		</ToolShell>
	);
}
