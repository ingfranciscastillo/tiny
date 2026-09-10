import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";

import ToolShell, { WorkSurface } from "#/components/ToolShell";
import { toolHead } from "#/lib/seo";

export const Route = createFileRoute("/tools/average-median")({
	head: () => toolHead("average-median"),
	component: AverageMedian,
});

interface Stats {
	count: number;
	sum: number;
	avg: number;
	median: number;
	min: number;
	max: number;
}

function AverageMedian() {
	const [input, setInput] = useState("");
	const stats = useMemo<Stats | null>(() => {
		const nums = input
			.split(/[\s,]+/)
			.map(Number)
			.filter((n) => !Number.isNaN(n));
		if (nums.length === 0) return null;
		const sum = nums.reduce((a, b) => a + b, 0);
		const avg = sum / nums.length;
		const sorted = [...nums].sort((a, b) => a - b);
		const mid = Math.floor(sorted.length / 2);
		const median =
			sorted.length % 2 === 0
				? (sorted[mid - 1] + sorted[mid]) / 2
				: sorted[mid];
		return {
			count: nums.length,
			sum,
			avg,
			median,
			min: sorted[0],
			max: sorted[sorted.length - 1],
		};
	}, [input]);

	return (
		<ToolShell
			toolId="average-median"
			title="Average / Median"
			description="Basic statistics"
			runsLocally
		>
			<WorkSurface
				label="numbers (space or comma separated)"
				value={input}
				onChange={(e) => setInput(e.target.value)}
				placeholder="1 2 3 4 5"
				rows={4}
			/>
			{stats && (
				<div className="border border-rule bg-surface divide-y divide-border">
					{(
						[
							["count", String(stats.count)],
							["sum", String(stats.sum)],
							["average", stats.avg.toFixed(4)],
							["median", String(stats.median)],
							["min", String(stats.min)],
							["max", String(stats.max)],
						] as const
					).map(([k, v]) => (
						<div
							key={k}
							className="flex items-center justify-between px-3.5 py-2.5"
						>
							<span className="font-mono text-[10px] uppercase tracking-wide text-muted w-20">
								{k}
							</span>
							<span className="font-mono text-sm">{v}</span>
						</div>
					))}
				</div>
			)}
		</ToolShell>
	);
}
