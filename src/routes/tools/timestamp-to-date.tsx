import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";

import CopyButton from "#/components/CopyButton";
import ToolShell from "#/components/ToolShell";
import { toolHead } from "#/lib/seo";

export const Route = createFileRoute("/tools/timestamp-to-date")({
	head: () => toolHead("timestamp-to-date"),
	component: TimestampToDate,
});

interface DateResults {
	utc: string;
	iso: string;
	local: string;
}

function TimestampToDate() {
	const [input, setInput] = useState(String(Math.floor(Date.now() / 1000)));
	const results = useMemo<DateResults | null>(() => {
		const n = Number(input);
		if (!n) return null;
		const d = new Date(n < 1e12 ? n * 1000 : n);
		if (Number.isNaN(d.getTime())) return null;
		return {
			utc: d.toUTCString(),
			iso: d.toISOString(),
			local: d.toLocaleString(),
		};
	}, [input]);

	return (
		<ToolShell
			toolId="timestamp-to-date"
			title="Timestamp → Date"
			description="Unix timestamp to readable date"
			runsLocally
		>
			<div>
				<label
					htmlFor="ts-to-date-input"
					className="font-mono text-[11px] uppercase tracking-wide text-muted block mb-1.5"
				>
					unix timestamp
				</label>
				<input
					id="ts-to-date-input"
					value={input}
					onChange={(e) => setInput(e.target.value.replace(/[^0-9]/g, ""))}
					spellCheck={false}
					className="w-full font-mono text-sm bg-surface border border-rule rounded-none px-3.5 py-3 focus:outline-none focus:border-accent transition-tiny"
				/>
			</div>
			{results ? (
				<div className="border border-rule bg-surface divide-y divide-border">
					{(
						[
							["utc", results.utc],
							["iso", results.iso],
							["local", results.local],
						] as const
					).map(([k, v]) => (
						<div
							key={k}
							className="flex items-center justify-between px-3.5 py-2.5"
						>
							<span className="font-mono text-[10px] uppercase tracking-wide text-muted w-16">
								{k}
							</span>
							<span className="font-mono text-sm flex-1 break-all">{v}</span>
							<CopyButton value={v} label="copy" />
						</div>
					))}
				</div>
			) : (
				<div className="font-mono text-xs text-accent border-l-2 border-accent pl-3 py-1">
					invalid timestamp
				</div>
			)}
		</ToolShell>
	);
}
