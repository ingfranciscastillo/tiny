import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import ToolShell, { OutputBlock } from "#/components/ToolShell";
import { toolHead } from "#/lib/seo";

export const Route = createFileRoute("/tools/date-generator")({
	head: () => toolHead("date-generator"),
	component: DateGenerator,
});

function DateGenerator() {
	const [start, setStart] = useState("2000-01-01");
	const [end, setEnd] = useState("2025-12-31");
	const [count, setCount] = useState(5);
	const [output, setOutput] = useState("");

	const generate = () => {
		const s = new Date(start).getTime();
		const e = new Date(end).getTime();
		if (Number.isNaN(s) || Number.isNaN(e) || s > e) {
			setOutput("invalid range");
			return;
		}
		const arr = Array.from({ length: Math.min(50, count) }, () => {
			const d = new Date(s + Math.random() * (e - s));
			return d.toISOString().slice(0, 10);
		});
		setOutput(arr.join("\n"));
	};

	return (
		<ToolShell
			toolId="date-generator"
			title="Date Generator"
			description="Generate random dates"
			runsLocally
		>
			<div className="grid grid-cols-2 gap-3">
				<div>
					<label
						htmlFor="date-gen-start"
						className="font-mono text-[11px] uppercase tracking-wide text-muted block mb-1.5"
					>
						start
					</label>
					<input
						id="date-gen-start"
						type="date"
						value={start}
						onChange={(e) => setStart(e.target.value)}
						className="w-full font-mono text-sm bg-surface border border-rule rounded-none px-3 py-2 focus:outline-none focus:border-accent transition-tiny"
					/>
				</div>
				<div>
					<label
						htmlFor="date-gen-end"
						className="font-mono text-[11px] uppercase tracking-wide text-muted block mb-1.5"
					>
						end
					</label>
					<input
						id="date-gen-end"
						type="date"
						value={end}
						onChange={(e) => setEnd(e.target.value)}
						className="w-full font-mono text-sm bg-surface border border-rule rounded-none px-3 py-2 focus:outline-none focus:border-accent transition-tiny"
					/>
				</div>
			</div>
			<div className="flex items-end gap-3">
				<div>
					<label
						htmlFor="date-gen-count"
						className="font-mono text-[11px] uppercase tracking-wide text-muted block mb-1.5"
					>
						count
					</label>
					<input
						id="date-gen-count"
						type="number"
						min="1"
						max="50"
						value={count}
						onChange={(e) => setCount(Number(e.target.value))}
						className="w-24 font-mono text-sm bg-surface border border-rule rounded-none px-3 py-2 focus:outline-none focus:border-accent transition-tiny"
					/>
				</div>
				<button
					type="button"
					onClick={generate}
					className="font-mono text-xs uppercase tracking-wide px-3 py-2 border border-rule rounded-none transition-tiny hover:text-accent hover:border-accent"
				>
					Generate
				</button>
			</div>
			<OutputBlock value={output} placeholder="2023-06-15" copyLabel="Copy" />
		</ToolShell>
	);
}
