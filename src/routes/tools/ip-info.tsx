import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";

import ToolShell from "#/components/ToolShell";
import { toolHead } from "#/lib/seo";

export const Route = createFileRoute("/tools/ip-info")({
	head: () => toolHead("ip-info"),
	component: IpInfo,
});

interface IpParseResult {
	valid: boolean;
	version: 4 | 6 | null;
	parts: (string | number)[];
	int: number | null;
	private: boolean;
}

function parseIp(ip: string): IpParseResult {
	const v4 = ip.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/);
	if (v4) {
		const parts = v4.slice(1).map(Number);
		if (parts.every((p) => p >= 0 && p <= 255)) {
			return {
				version: 4,
				valid: true,
				parts,
				int: parts.reduce((a, b) => a * 256 + b, 0),
				private:
					parts[0] === 10 ||
					(parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) ||
					(parts[0] === 192 && parts[1] === 168),
			};
		}
	}
	if (ip.includes(":")) {
		return {
			version: 6,
			valid: ip.split(":").length >= 2,
			parts: ip.split(":"),
			int: null,
			private:
				ip.startsWith("fe80") || ip.startsWith("fc") || ip.startsWith("fd"),
		};
	}
	return { valid: false, version: null, parts: [], int: null, private: false };
}

function IpInfo() {
	const [input, setInput] = useState("192.168.1.1");
	const info = useMemo(
		() => (input.trim() ? parseIp(input.trim()) : null),
		[input],
	);

	return (
		<ToolShell
			toolId="ip-info"
			title="IP Address Info"
			description="Parse and validate IP addresses"
			runsLocally
		>
			<div>
				<label
					htmlFor="ip-info-input"
					className="font-mono text-[11px] uppercase tracking-wide text-muted block mb-1.5"
				>
					ip address
				</label>
				<input
					id="ip-info-input"
					value={input}
					onChange={(e) => setInput(e.target.value)}
					spellCheck={false}
					className="w-full font-mono text-sm bg-surface border border-rule rounded-none px-3.5 py-3 focus:outline-none focus:border-accent transition-tiny"
				/>
			</div>
			{info &&
				(info.valid ? (
					<div className="border border-rule bg-surface divide-y divide-border">
						{(
							[
								["version", `IPv${info.version}`],
								["valid", "✓ yes"],
								["type", info.private ? "private" : "public"],
								["integer", info.int ? String(info.int) : "—"],
								["parts", info.parts.join(info.version === 4 ? "." : ":")],
							] as const
						).map(([k, v]) => (
							<div
								key={k}
								className="flex items-center justify-between px-3.5 py-2.5"
							>
								<span className="font-mono text-[10px] uppercase tracking-wide text-muted w-20">
									{k}
								</span>
								<span className="font-mono text-sm">{v}</span>
							</div>
						))}
					</div>
				) : (
					<div className="font-mono text-xs text-accent border-l-2 border-accent pl-3 py-1">
						invalid IP address
					</div>
				))}
		</ToolShell>
	);
}
