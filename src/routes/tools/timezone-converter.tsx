import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";

import CopyButton from "#/components/CopyButton";
import ToolShell from "#/components/ToolShell";
import { toolHead } from "#/lib/seo";

export const Route = createFileRoute("/tools/timezone-converter")({
	head: () => toolHead("timezone-converter"),
	component: TimezoneConverter,
});

const TZS = [
	"UTC",
	"America/New_York",
	"America/Los_Angeles",
	"America/Santo_Domingo",
	"Europe/London",
	"Europe/Paris",
	"Asia/Tokyo",
	"Asia/Shanghai",
	"Australia/Sydney",
	"Pacific/Auckland",
];

interface TzResult {
	tz: string;
	str: string;
}

function TimezoneConverter() {
	const [time, setTime] = useState(new Date().toISOString().slice(0, 16));
	const [fromTz, setFromTz] = useState("UTC");

	// biome-ignore lint/correctness/useExhaustiveDependencies: fromTz only relabels the input, the browser always parses `time` as local wall-clock time
	const results = useMemo<TzResult[]>(() => {
		if (!time) return [];
		const d = new Date(time);
		if (Number.isNaN(d.getTime())) return [];
		return TZS.map((tz) => {
			try {
				return {
					tz,
					str: d.toLocaleString("en-US", {
						timeZone: tz,
						dateStyle: "medium",
						timeStyle: "medium",
					}),
				};
			} catch {
				return { tz, str: "—" };
			}
		});
	}, [time, fromTz]);

	return (
		<ToolShell
			toolId="timezone-converter"
			title="Timezone Converter"
			description="Convert between timezones"
			runsLocally
		>
			<div className="flex items-end gap-3">
				<div className="flex-1">
					<label
						htmlFor="tz-time-input"
						className="font-mono text-[11px] uppercase tracking-wide text-muted block mb-1.5"
					>
						time ({fromTz})
					</label>
					<input
						id="tz-time-input"
						type="datetime-local"
						value={time}
						onChange={(e) => setTime(e.target.value)}
						className="w-full font-mono text-sm bg-surface border border-rule rounded-none px-3 py-2 focus:outline-none focus:border-accent transition-tiny"
					/>
				</div>
				<div>
					<label
						htmlFor="tz-from-select"
						className="font-mono text-[11px] uppercase tracking-wide text-muted block mb-1.5"
					>
						from
					</label>
					<select
						id="tz-from-select"
						value={fromTz}
						onChange={(e) => setFromTz(e.target.value)}
						className="font-mono text-sm bg-surface border border-rule rounded-none px-3 py-2 focus:outline-none focus:border-accent transition-tiny"
					>
						{TZS.map((tz) => (
							<option key={tz} value={tz}>
								{tz}
							</option>
						))}
					</select>
				</div>
			</div>
			<div className="border-t border-rule">
				{results.map(({ tz, str }) => (
					<div
						key={tz}
						className="flex items-center justify-between border-b border-rule py-2.5 px-1"
					>
						<span className="font-mono text-xs text-muted w-44 truncate">
							{tz}
						</span>
						<span className="font-mono text-sm flex-1 text-right">{str}</span>
						<CopyButton value={str} label="copy" />
					</div>
				))}
			</div>
		</ToolShell>
	);
}
