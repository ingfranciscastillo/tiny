import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";

import CopyButton from "#/components/CopyButton";
import ToolShell from "#/components/ToolShell";
import { toolHead } from "#/lib/seo";

export const Route = createFileRoute("/tools/date-to-timestamp")({
	head: () => toolHead("date-to-timestamp"),
	component: DateToTimestamp,
});

interface TimestampResults {
	seconds: number;
	ms: number;
}

function DateToTimestamp() {
	const [input, setInput] = useState(new Date().toISOString().slice(0, 19));
	const results = useMemo<TimestampResults | null>(() => {
		if (!input) return null;
		const d = new Date(input);
		if (Number.isNaN(d.getTime())) return null;
		return { seconds: Math.floor(d.getTime() / 1000), ms: d.getTime() };
	}, [input]);

	return (
		<ToolShell
			toolId="date-to-timestamp"
			title="Date → Timestamp"
			description="Date to Unix timestamp"
			runsLocally
		>
			<div>
				<label
					htmlFor="date-to-ts-input"
					className="font-mono text-[11px] uppercase tracking-wide text-muted block mb-1.5"
				>
					date (ISO or local)
				</label>
				<input
					id="date-to-ts-input"
					value={input}
					onChange={(e) => setInput(e.target.value)}
					spellCheck={false}
					className="w-full font-mono text-sm bg-surface border border-rule rounded-none px-3.5 py-3 focus:outline-none focus:border-accent transition-tiny"
				/>
			</div>
			{results ? (
				<div className="border border-rule bg-surface divide-y divide-border">
					{(
						[
							["seconds", String(results.seconds)],
							["milliseconds", String(results.ms)],
						] as const
					).map(([k, v]) => (
						<div
							key={k}
							className="flex items-center justify-between px-3.5 py-2.5"
						>
							<span className="font-mono text-[10px] uppercase tracking-wide text-muted w-24">
								{k}
							</span>
							<span className="font-mono text-sm flex-1">{v}</span>
							<CopyButton value={v} label="copy" />
						</div>
					))}
				</div>
			) : (
				<div className="font-mono text-xs text-accent border-l-2 border-accent pl-3 py-1">
					invalid date
				</div>
			)}
		</ToolShell>
	);
}
