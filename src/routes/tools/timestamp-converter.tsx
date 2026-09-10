import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import CopyButton from "#/components/CopyButton";
import ToolShell from "#/components/ToolShell";
import { toolHead } from "#/lib/seo";

export const Route = createFileRoute("/tools/timestamp-converter")({
	head: () => toolHead("timestamp"),
	component: TimestampConverter,
});

type TimestampInfo =
	| { error: string }
	| { isoUtc: string; isoLocal: string; relative: string };

function relative(ms: number): string {
	const diff = ms - Date.now();
	const abs = Math.abs(diff);
	const s = Math.round(abs / 1000);
	const m = Math.round(s / 60);
	const h = Math.round(m / 60);
	const d = Math.round(h / 24);
	const unit = (v: number, u: string) => `${v} ${u}${v === 1 ? "" : "s"}`;
	let str: string;
	if (s < 60) str = unit(s, "second");
	else if (m < 60) str = unit(m, "minute");
	else if (h < 24) str = unit(h, "hour");
	else str = unit(d, "day");
	return diff >= 0 ? `in ${str}` : `${str} ago`;
}

function fmt(ts: string): TimestampInfo {
	const n = Number(ts);
	if (!Number.isFinite(n)) return { error: "not a number" };
	const ms = ts.toString().length <= 10 ? n * 1000 : n;
	const d = new Date(ms);
	if (Number.isNaN(d.getTime())) return { error: "invalid date" };
	return {
		isoUtc: d.toISOString(),
		isoLocal: d.toLocaleString(),
		relative: relative(ms),
	};
}

function TimestampConverter() {
	const [input, setInput] = useState(String(Math.floor(Date.now() / 1000)));
	const info = input.trim() ? fmt(input.trim()) : null;
	const now = Math.floor(Date.now() / 1000);

	return (
		<ToolShell
			toolId="timestamp"
			title="Timestamp Converter"
			description="Convert Unix timestamps to readable dates"
			runsLocally
		>
			<div>
				<label
					htmlFor="timestamp-input"
					className="font-mono text-[11px] uppercase tracking-wide text-muted block mb-1.5"
				>
					unix timestamp
				</label>
				<input
					id="timestamp-input"
					value={input}
					onChange={(e) => setInput(e.target.value)}
					spellCheck={false}
					placeholder="1693900000"
					className="w-full font-mono text-sm bg-surface border border-rule rounded-none px-3.5 py-3 focus:outline-none focus:border-accent transition-tiny"
				/>
			</div>

			{info && "isoUtc" in info && (
				<div className="border border-rule bg-surface divide-y divide-border">
					<Row label="ISO UTC" value={info.isoUtc} />
					<Row label="Local" value={info.isoLocal} />
					<Row label="Relative" value={info.relative} />
				</div>
			)}
			{info && "error" in info && (
				<div className="font-mono text-xs text-accent border-l-2 border-accent pl-3 py-1">
					{info.error}
				</div>
			)}

			<div className="flex items-center justify-between border-t border-rule pt-4">
				<div className="font-mono text-xs text-muted">now · {now}</div>
				<CopyButton value={String(now)} label="copy now" />
			</div>
		</ToolShell>
	);
}

interface RowProps {
	label: string;
	value: string;
}

function Row({ label, value }: RowProps) {
	return (
		<div className="flex items-center justify-between px-3.5 py-2.5 group">
			<div className="min-w-0">
				<div className="font-mono text-[10px] uppercase tracking-wide text-muted">
					{label}
				</div>
				<div className="font-mono text-sm truncate">{value}</div>
			</div>
			<CopyButton
				value={value}
				label="copy"
				className="opacity-0 group-hover:opacity-100"
			/>
		</div>
	);
}
