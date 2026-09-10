import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";

import ToolShell from "#/components/ToolShell";
import { toolHead } from "#/lib/seo";

export const Route = createFileRoute("/tools/subnet-calculator")({
	head: () => toolHead("subnet-calculator"),
	component: SubnetCalculator,
});

interface SubnetInfo {
	network: string;
	broadcast: string;
	wildcard: string;
	hosts: number;
	bits: number;
}

function intToIp(n: number): string {
	return [(n >>> 24) & 255, (n >>> 16) & 255, (n >>> 8) & 255, n & 255].join(
		".",
	);
}

function subnetInfo(ip: string, mask: string): SubnetInfo | null {
	const ipParts = ip.split(".").map(Number);
	const maskParts = mask.split(".").map(Number);
	if (
		!ipParts.every((p) => p >= 0 && p <= 255) ||
		!maskParts.every((p) => p >= 0 && p <= 255)
	)
		return null;
	const ipInt = ipParts.reduce((a, b) => a * 256 + b, 0);
	const maskInt = maskParts.reduce((a, b) => a * 256 + b, 0);
	const network = (ipInt & maskInt) >>> 0;
	const broadcast = (network | (~maskInt >>> 0)) >>> 0;
	const bits = maskParts.reduce(
		(a, b) => a + (b.toString(2).match(/1/g) || []).length,
		0,
	);
	const hosts = bits >= 31 ? (bits === 32 ? 1 : 2) : 2 ** (32 - bits) - 2;
	return {
		network: intToIp(network),
		broadcast: intToIp(broadcast),
		wildcard: intToIp(~maskInt >>> 0),
		hosts,
		bits,
	};
}

function SubnetCalculator() {
	const [ip, setIp] = useState("192.168.1.100");
	const [mask, setMask] = useState("255.255.255.0");
	const result = useMemo(() => subnetInfo(ip, mask), [ip, mask]);

	return (
		<ToolShell
			toolId="subnet-calculator"
			title="Subnet Calculator"
			description="Subnet information"
			runsLocally
		>
			<div className="grid grid-cols-2 gap-3">
				<div>
					<label
						htmlFor="subnet-ip"
						className="font-mono text-[11px] uppercase tracking-wide text-muted block mb-1.5"
					>
						ip address
					</label>
					<input
						id="subnet-ip"
						value={ip}
						onChange={(e) => setIp(e.target.value)}
						spellCheck={false}
						className="w-full font-mono text-sm bg-surface border border-rule rounded-none px-3 py-2 focus:outline-none focus:border-accent transition-tiny"
					/>
				</div>
				<div>
					<label
						htmlFor="subnet-mask"
						className="font-mono text-[11px] uppercase tracking-wide text-muted block mb-1.5"
					>
						subnet mask
					</label>
					<input
						id="subnet-mask"
						value={mask}
						onChange={(e) => setMask(e.target.value)}
						spellCheck={false}
						className="w-full font-mono text-sm bg-surface border border-rule rounded-none px-3 py-2 focus:outline-none focus:border-accent transition-tiny"
					/>
				</div>
			</div>
			{result ? (
				<div className="border border-rule bg-surface divide-y divide-border">
					{(
						[
							["network", result.network],
							["broadcast", result.broadcast],
							["wildcard", result.wildcard],
							["prefix bits", `/${result.bits}`],
							["hosts", String(result.hosts)],
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
				<div className="font-mono text-xs text-accent border-l-2 border-accent pl-3 py-1">
					invalid input
				</div>
			)}
		</ToolShell>
	);
}
