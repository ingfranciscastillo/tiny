import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";

import CopyButton from "#/components/CopyButton";
import ToolShell from "#/components/ToolShell";
import { toolHead } from "#/lib/seo";

export const Route = createFileRoute("/tools/ipv4-ipv6")({
	head: () => toolHead("ipv4-ipv6"),
	component: Ipv4Ipv6,
});

function v4ToV6(ip: string): string | null {
	const v4 = ip.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/);
	if (!v4) return null;
	const parts = v4.slice(1).map(Number);
	if (!parts.every((p) => p >= 0 && p <= 255)) return null;
	const hex1 = ((parts[0] << 8) | parts[1]).toString(16).padStart(4, "0");
	const hex2 = ((parts[2] << 8) | parts[3]).toString(16).padStart(4, "0");
	return `::ffff:${hex1}:${hex2}`;
}

function v6ToV4(ip: string): string | null {
	const m =
		ip.match(/::ffff:([0-9a-f]{1,4}):([0-9a-f]{1,4})$/i) ||
		ip.match(/::ffff:([0-9.]+)$/i);
	if (!m) return null;
	if (m[1].includes(".")) return m[1];
	const p1 = Number.parseInt(m[1], 16);
	const p2 = Number.parseInt(m[2], 16);
	return `${(p1 >> 8) & 255}.${p1 & 255}.${(p2 >> 8) & 255}.${p2 & 255}`;
}

interface ConversionResult {
	dir: string;
	out: string | null;
}

function Ipv4Ipv6() {
	const [input, setInput] = useState("192.168.1.1");
	const result = useMemo<ConversionResult | null>(() => {
		if (!input.trim()) return null;
		if (input.includes(":")) return { dir: "v6 → v4", out: v6ToV4(input) };
		return { dir: "v4 → v6", out: v4ToV6(input) };
	}, [input]);

	return (
		<ToolShell
			toolId="ipv4-ipv6"
			title="IPv4 ↔ IPv6"
			description="Convert IP representations"
			runsLocally
		>
			<div>
				<label
					htmlFor="ipv4-ipv6-input"
					className="font-mono text-[11px] uppercase tracking-wide text-muted block mb-1.5"
				>
					ip address
				</label>
				<input
					id="ipv4-ipv6-input"
					value={input}
					onChange={(e) => setInput(e.target.value)}
					spellCheck={false}
					className="w-full font-mono text-sm bg-surface border border-rule rounded-none px-3.5 py-3 focus:outline-none focus:border-accent transition-tiny"
				/>
			</div>
			{result && (
				<div className="border border-rule bg-surface px-3.5 py-3">
					<div className="font-mono text-[10px] uppercase tracking-wide text-muted mb-1">
						{result.dir}
					</div>
					<div className="flex items-center justify-between">
						<span className="font-mono text-sm break-all">
							{result.out || "invalid"}
						</span>
						{result.out && <CopyButton value={result.out} label="copy" />}
					</div>
				</div>
			)}
		</ToolShell>
	);
}
