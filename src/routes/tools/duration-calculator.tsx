import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";

import ToolShell from "#/components/ToolShell";
import { toolHead } from "#/lib/seo";

export const Route = createFileRoute("/tools/duration-calculator")({
	head: () => toolHead("duration-calculator"),
	component: DurationCalculator,
});

interface Duration {
	ms: number;
	days: number;
	hours: number;
	mins: number;
	secs: number;
	totalHours: string;
	totalDays: string;
}

function DurationCalculator() {
	const [start, setStart] = useState(
		new Date(Date.now() - 86400000).toISOString().slice(0, 16),
	);
	const [end, setEnd] = useState(new Date().toISOString().slice(0, 16));
	const result = useMemo<Duration | null>(() => {
		const s = new Date(start);
		const e = new Date(end);
		if (Number.isNaN(s.getTime()) || Number.isNaN(e.getTime())) return null;
		const diff = Math.abs(e.getTime() - s.getTime());
		const days = Math.floor(diff / 86400000);
		const hours = Math.floor((diff % 86400000) / 3600000);
		const mins = Math.floor((diff % 3600000) / 60000);
		const secs = Math.floor((diff % 60000) / 1000);
		return {
			ms: diff,
			days,
			hours,
			mins,
			secs,
			totalHours: (diff / 3600000).toFixed(2),
			totalDays: (diff / 86400000).toFixed(4),
		};
	}, [start, end]);

	return (
		<ToolShell
			toolId="duration-calculator"
			title="Duration Calculator"
			description="Calculate time between two dates"
			runsLocally
		>
			<div className="grid grid-cols-2 gap-3">
				<div>
					<label
						htmlFor="duration-start"
						className="font-mono text-[11px] uppercase tracking-wide text-muted block mb-1.5"
					>
						start
					</label>
					<input
						id="duration-start"
						type="datetime-local"
						value={start}
						onChange={(e) => setStart(e.target.value)}
						className="w-full font-mono text-sm bg-surface border border-rule rounded-none px-3 py-2 focus:outline-none focus:border-accent transition-tiny"
					/>
				</div>
				<div>
					<label
						htmlFor="duration-end"
						className="font-mono text-[11px] uppercase tracking-wide text-muted block mb-1.5"
					>
						end
					</label>
					<input
						id="duration-end"
						type="datetime-local"
						value={end}
						onChange={(e) => setEnd(e.target.value)}
						className="w-full font-mono text-sm bg-surface border border-rule rounded-none px-3 py-2 focus:outline-none focus:border-accent transition-tiny"
					/>
				</div>
			</div>
			{result && (
				<div className="border border-rule bg-surface divide-y divide-border">
					{(
						[
							["days", String(result.days)],
							["hours", String(result.hours)],
							["minutes", String(result.mins)],
							["seconds", String(result.secs)],
							["total hours", result.totalHours],
							["total days", result.totalDays],
						] as const
					).map(([k, v]) => (
						<div
							key={k}
							className="flex items-center justify-between px-3.5 py-2.5"
						>
							<span className="font-mono text-[10px] uppercase tracking-wide text-muted w-24">
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
