import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";

import CopyButton from "#/components/CopyButton";
import ToolShell from "#/components/ToolShell";
import { toolHead } from "#/lib/seo";

export const Route = createFileRoute("/tools/ip-range")({
	head: () => toolHead("ip-range"),
	component: IpRange,
});

function intToIp(n: number): string {
	return [(n >>> 24) & 255, (n >>> 16) & 255, (n >>> 8) & 255, n & 255].join(
		".",
	);
}

function ipToInt(ip: string): number {
	return (
		ip
			.split(".")
			.map(Number)
			.reduce((a, b) => a * 256 + b, 0) >>> 0
	);
}

interface RangeResult {
	count: number;
	start: string;
	end: string;
	list: string[] | null;
}

function IpRange() {
	const [start, setStart] = useState("192.168.1.1");
	const [end, setEnd] = useState("192.168.1.254");
	const result = useMemo<RangeResult | null>(() => {
		if (!start || !end) return null;
		try {
			const s = ipToInt(start);
			const e = ipToInt(end);
			if (s > e) return null;
			return {
				count: e - s + 1,
				start: intToIp(s),
				end: intToIp(e),
				list:
					e - s <= 256
						? Array.from({ length: e - s + 1 }, (_, i) => intToIp(s + i))
						: null,
			};
		} catch {
			return null;
		}
	}, [start, end]);

	return (
		<ToolShell
			toolId="ip-range"
			title="IP Range Calculator"
			description="Calculate IP ranges"
			runsLocally
		>
			<div className="grid grid-cols-2 gap-3">
				<div>
					<label
						htmlFor="ip-range-start"
						className="font-mono text-[11px] uppercase tracking-wide text-muted block mb-1.5"
					>
						start ip
					</label>
					<input
						id="ip-range-start"
						value={start}
						onChange={(e) => setStart(e.target.value)}
						spellCheck={false}
						className="w-full font-mono text-sm bg-surface border border-rule rounded-none px-3 py-2 focus:outline-none focus:border-accent transition-tiny"
					/>
				</div>
				<div>
					<label
						htmlFor="ip-range-end"
						className="font-mono text-[11px] uppercase tracking-wide text-muted block mb-1.5"
					>
						end ip
					</label>
					<input
						id="ip-range-end"
						value={end}
						onChange={(e) => setEnd(e.target.value)}
						spellCheck={false}
						className="w-full font-mono text-sm bg-surface border border-rule rounded-none px-3 py-2 focus:outline-none focus:border-accent transition-tiny"
					/>
				</div>
			</div>
			{result ? (
				<>
					<div className="border border-rule bg-surface px-3.5 py-3 flex items-center justify-between">
						<span className="font-mono text-sm text-muted">
							total addresses
						</span>
						<span className="font-mono text-2xl">{result.count}</span>
					</div>
					{result.list && (
						<div className="border border-rule bg-surface max-h-48 overflow-auto">
							{result.list.map((ip) => (
								<div
									key={ip}
									className="flex items-center justify-between border-b border-rule px-3.5 py-1.5 last:border-b-0"
								>
									<span className="font-mono text-xs">{ip}</span>
									<CopyButton value={ip} label="copy" />
								</div>
							))}
						</div>
					)}
					{result.count > 256 && (
						<div className="font-mono text-xs text-muted">
							range too large to list (max 256)
						</div>
					)}
				</>
			) : (
				<div className="font-mono text-xs text-accent border-l-2 border-accent pl-3 py-1">
					invalid range
				</div>
			)}
		</ToolShell>
	);
}
