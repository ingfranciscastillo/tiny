import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";

import CopyButton from "#/components/CopyButton";
import ToolShell from "#/components/ToolShell";
import { toolHead } from "#/lib/seo";

export const Route = createFileRoute("/tools/date-converter")({
	head: () => toolHead("date-converter"),
	component: DateConverter,
});

interface DateFormats {
	iso: string;
	local: string;
	date: string;
	time: string;
	rfc: string;
}

function DateConverter() {
	const [input, setInput] = useState(new Date().toISOString().slice(0, 10));
	const results = useMemo<DateFormats | null>(() => {
		if (!input) return null;
		const d = new Date(input);
		if (Number.isNaN(d.getTime())) return null;
		return {
			iso: d.toISOString(),
			local: d.toLocaleString(),
			date: d.toDateString(),
			time: d.toTimeString(),
			rfc: d.toUTCString(),
		};
	}, [input]);

	return (
		<ToolShell
			toolId="date-converter"
			title="Date Converter"
			description="Convert between date formats"
			runsLocally
		>
			<div>
				<label
					htmlFor="date-converter-input"
					className="font-mono text-[11px] uppercase tracking-wide text-muted block mb-1.5"
				>
					date input
				</label>
				<input
					id="date-converter-input"
					type="text"
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
							["iso 8601", results.iso],
							["local", results.local],
							["date", results.date],
							["time", results.time],
							["rfc 2822", results.rfc],
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
					invalid date
				</div>
			)}
		</ToolShell>
	);
}
