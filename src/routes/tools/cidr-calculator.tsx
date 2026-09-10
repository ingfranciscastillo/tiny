import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";

import ToolShell from "#/components/ToolShell";
import { toolHead } from "#/lib/seo";

export const Route = createFileRoute("/tools/cidr-calculator")({
	head: () => toolHead("cidr-calculator"),
	component: CidrCalculator,
});

interface CidrResult {
	network: string;
	broadcast: string;
	mask: string;
	firstHost: string;
	lastHost: string;
	hosts: number;
	prefix: number;
}

function intToIp(n: number): string {
	return [(n >>> 24) & 255, (n >>> 16) & 255, (n >>> 8) & 255, n & 255].join(
		".",
	);
}

function parseCidr(cidr: string): CidrResult | null {
	const m = cidr.match(/^(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})\/(\d{1,2})$/);
	if (!m) return null;
	const ip = m[1].split(".").map(Number);
	if (!ip.every((p) => p >= 0 && p <= 255)) return null;
	const prefix = Number.parseInt(m[2], 10);
	if (prefix > 32) return null;
	const ipInt = ip.reduce((a, b) => a * 256 + b, 0);
	const mask = prefix === 0 ? 0 : (0xffffffff << (32 - prefix)) >>> 0;
	const network = (ipInt & mask) >>> 0;
	const broadcast = (network | (~mask >>> 0)) >>> 0;
	const hosts = prefix >= 31 ? (prefix === 32 ? 1 : 2) : 2 ** (32 - prefix) - 2;
	return {
		network: intToIp(network),
		broadcast: intToIp(broadcast),
		mask: intToIp(mask),
		firstHost: intToIp(prefix < 31 ? network + 1 : network),
		lastHost: intToIp(prefix < 31 ? broadcast - 1 : broadcast),
		hosts,
		prefix,
	};
}

function CidrCalculator() {
	const [input, setInput] = useState("192.168.1.0/24");
	const result = useMemo(
		() => (input.trim() ? parseCidr(input.trim()) : null),
		[input],
	);

	return (
		<ToolShell
			toolId="cidr-calculator"
			title="CIDR Calculator"
			description="Calculate network ranges"
			runsLocally
		>
			<div>
				<label
					htmlFor="cidr-input"
					className="font-mono text-[11px] uppercase tracking-wide text-muted block mb-1.5"
				>
					cidr
				</label>
				<input
					id="cidr-input"
					value={input}
					onChange={(e) => setInput(e.target.value)}
					spellCheck={false}
					className="w-full font-mono text-sm bg-surface border border-rule rounded-none px-3.5 py-3 focus:outline-none focus:border-accent transition-tiny"
				/>
			</div>
			{result ? (
				<div className="border border-rule bg-surface divide-y divide-border">
					{(
						[
							["network", result.network],
							["broadcast", result.broadcast],
							["subnet mask", result.mask],
							["first host", result.firstHost],
							["last host", result.lastHost],
							["usable hosts", String(result.hosts)],
							["prefix", `/${result.prefix}`],
						] as const
					).map(([k, v]) => (
						<div
							key={k}
							className="flex items-center justify-between px-3.5 py-2.5"
						>
							<span className="font-mono text-[10px] uppercase tracking-wide text-muted w-28">
								{k}
							</span>
							<span className="font-mono text-sm">{v}</span>
						</div>
					))}
				</div>
			) : (
				input && (
					<div className="font-mono text-xs text-accent border-l-2 border-accent pl-3 py-1">
						invalid CIDR
					</div>
				)
			)}
		</ToolShell>
	);
}
