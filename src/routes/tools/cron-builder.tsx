import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";

import ToolShell, { OutputBlock } from "#/components/ToolShell";
import { toolHead } from "#/lib/seo";

export const Route = createFileRoute("/tools/cron-builder")({
	head: () => toolHead("cron-builder"),
	component: CronBuilder,
});

function CronBuilder() {
	const [min, setMin] = useState("*");
	const [hour, setHour] = useState("*");
	const [dom, setDom] = useState("*");
	const [mon, setMon] = useState("*");
	const [dow, setDow] = useState("*");

	const expr = useMemo(
		() => `${min} ${hour} ${dom} ${mon} ${dow}`,
		[min, hour, dom, mon, dow],
	);

	const fields = [
		{ label: "minute", value: min, set: setMin, placeholder: "0-59" },
		{ label: "hour", value: hour, set: setHour, placeholder: "0-23" },
		{ label: "day of month", value: dom, set: setDom, placeholder: "1-31" },
		{ label: "month", value: mon, set: setMon, placeholder: "1-12" },
		{ label: "day of week", value: dow, set: setDow, placeholder: "0-6" },
	];

	return (
		<ToolShell
			toolId="cron-builder"
			title="Cron Builder"
			description="Build cron expressions"
			runsLocally
		>
			<div className="space-y-2">
				{fields.map((f) => (
					<div key={f.label} className="flex items-center gap-3">
						<span className="font-mono text-[11px] uppercase tracking-wide text-muted w-28">
							{f.label}
						</span>
						<input
							value={f.value}
							onChange={(e) => f.set(e.target.value)}
							placeholder={f.placeholder}
							spellCheck={false}
							className="flex-1 font-mono text-sm bg-surface border border-rule rounded-none px-3 py-2 focus:outline-none focus:border-accent transition-tiny"
						/>
					</div>
				))}
			</div>
			<OutputBlock value={expr} placeholder="* * * * *" copyLabel="Copy" />
		</ToolShell>
	);
}
