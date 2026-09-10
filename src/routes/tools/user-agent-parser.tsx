import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";

import ToolShell, { WorkSurface } from "#/components/ToolShell";
import { toolHead } from "#/lib/seo";

export const Route = createFileRoute("/tools/user-agent-parser")({
	head: () => toolHead("user-agent-parser"),
	component: UserAgentParser,
});

interface ParsedUA {
	browser: string;
	browserVer: string;
	os: string;
	engine: string;
	isMobile: boolean;
}

function parseUA(ua: string): ParsedUA {
	const browser = (() => {
		if (/Edg\//.test(ua)) return "Edge";
		if (/OPR\//.test(ua)) return "Opera";
		if (/Chrome\//.test(ua)) return "Chrome";
		if (/Firefox\//.test(ua)) return "Firefox";
		if (/Safari\//.test(ua)) return "Safari";
		return "Unknown";
	})();
	const browserVer =
		(ua.match(/(Edg|OPR|Chrome|Firefox|Version)\/([\d.]+)/) || [])[2] || "";
	const os = (() => {
		if (/Windows NT 10/.test(ua)) return "Windows 10/11";
		if (/Windows/.test(ua)) return "Windows";
		if (/Mac OS X/.test(ua)) return "macOS";
		if (/Android/.test(ua)) return "Android";
		if (/iPhone|iPad/.test(ua)) return "iOS";
		if (/Linux/.test(ua)) return "Linux";
		return "Unknown";
	})();
	const engine = /Gecko\/|Firefox\//.test(ua)
		? "Gecko"
		: /AppleWebKit\//.test(ua)
			? "WebKit/Blink"
			: "Unknown";
	const isMobile = /Mobile|Android|iPhone|iPad/.test(ua);
	return { browser, browserVer, os, engine, isMobile };
}

function UserAgentParser() {
	const [input, setInput] = useState("");
	const parsed = useMemo(() => (input.trim() ? parseUA(input) : null), [input]);

	return (
		<ToolShell
			toolId="user-agent-parser"
			title="User-Agent Parser"
			description="Parse a User-Agent string"
			runsLocally
		>
			<WorkSurface
				label="user-agent"
				value={input}
				onChange={(e) => setInput(e.target.value)}
				placeholder="Mozilla/5.0 ..."
				rows={4}
			/>
			{parsed && (
				<div className="border border-rule bg-surface divide-y divide-border">
					{(
						[
							[
								"browser",
								parsed.browserVer
									? `${parsed.browser} ${parsed.browserVer}`
									: parsed.browser,
							],
							["os", parsed.os],
							["engine", parsed.engine],
							["device", parsed.isMobile ? "Mobile" : "Desktop"],
						] as const
					).map(([k, v]) => (
						<div key={k} className="flex items-baseline gap-3 px-3.5 py-2.5">
							<span className="font-mono text-[10px] uppercase tracking-wide text-muted w-20">
								{k}
							</span>
							<span className="font-mono text-sm">{v}</span>
						</div>
					))}
				</div>
			)}
		</ToolShell>
	);
}
