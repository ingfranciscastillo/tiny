import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";

import CopyButton from "#/components/CopyButton";
import ToolShell from "#/components/ToolShell";
import { toolHead } from "#/lib/seo";

export const Route = createFileRoute("/tools/epoch-converter")({
	head: () => toolHead("epoch-converter"),
	component: EpochConverter,
});

interface EpochResults {
	iso: string;
	local: string;
	rfc: string;
	ms: number;
}

function EpochConverter() {
	const now = Date.now();
	const [input, setInput] = useState(String(Math.floor(now / 1000)));
	const results = useMemo<EpochResults | null>(() => {
		const n = Number(input);
		if (!n) return null;
		const ms = n < 1e12 ? n * 1000 : n;
		const d = new Date(ms);
		if (Number.isNaN(d.getTime())) return null;
		return {
			iso: d.toISOString(),
			local: d.toLocaleString(),
			rfc: d.toUTCString(),
			ms,
		};
	}, [input]);

	return (
		<ToolShell
			toolId="epoch-converter"
			title="Epoch Converter"
			description="Unix epoch utilities"
			runsLocally
		>
			<div>
				<label
					htmlFor="epoch-input"
					className="font-mono text-[11px] uppercase tracking-wide text-muted block mb-1.5"
				>
					epoch (seconds or ms)
				</label>
				<input
					id="epoch-input"
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
							["iso", results.iso],
							["local", results.local],
							["rfc", results.rfc],
							["ms", String(results.ms)],
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
					invalid epoch
				</div>
			)}
		</ToolShell>
	);
}
