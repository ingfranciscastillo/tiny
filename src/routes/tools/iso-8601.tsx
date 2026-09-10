import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";

import CopyButton from "#/components/CopyButton";
import ToolShell from "#/components/ToolShell";
import { toolHead } from "#/lib/seo";

export const Route = createFileRoute("/tools/iso-8601")({
	head: () => toolHead("iso-8601"),
	component: Iso8601,
});

interface Iso8601Parsed {
	iso: string;
	local: string;
	date: string;
	time: string;
	epoch: number;
}

function Iso8601() {
	const [input, setInput] = useState(new Date().toISOString());
	const parsed = useMemo<Iso8601Parsed | null>(() => {
		if (!input.trim()) return null;
		const d = new Date(input);
		if (Number.isNaN(d.getTime())) return null;
		return {
			iso: d.toISOString(),
			local: d.toLocaleString(),
			date: d.toISOString().slice(0, 10),
			time: d.toISOString().slice(11, 19),
			epoch: Math.floor(d.getTime() / 1000),
		};
	}, [input]);

	return (
		<ToolShell
			toolId="iso-8601"
			title="ISO 8601"
			description="Parse and generate ISO dates"
			runsLocally
		>
			<div>
				<label
					htmlFor="iso-8601-input"
					className="font-mono text-[11px] uppercase tracking-wide text-muted block mb-1.5"
				>
					iso date string
				</label>
				<input
					id="iso-8601-input"
					value={input}
					onChange={(e) => setInput(e.target.value)}
					spellCheck={false}
					className="w-full font-mono text-sm bg-surface border border-rule rounded-none px-3.5 py-3 focus:outline-none focus:border-accent transition-tiny"
				/>
			</div>
			{parsed ? (
				<div className="border border-rule bg-surface divide-y divide-border">
					{(
						[
							["iso 8601", parsed.iso],
							["date", parsed.date],
							["time", parsed.time],
							["local", parsed.local],
							["epoch", String(parsed.epoch)],
						] as const
					).map(([k, v]) => (
						<div
							key={k}
							className="flex items-center justify-between px-3.5 py-2.5"
						>
							<span className="font-mono text-[10px] uppercase tracking-wide text-muted w-20">
								{k}
							</span>
							<span className="font-mono text-sm flex-1 break-all">{v}</span>
							<CopyButton value={v} label="copy" />
						</div>
					))}
				</div>
			) : (
				<div className="font-mono text-xs text-accent border-l-2 border-accent pl-3 py-1">
					invalid ISO date
				</div>
			)}
		</ToolShell>
	);
}
