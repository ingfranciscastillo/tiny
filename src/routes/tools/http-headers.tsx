import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";

import ToolShell, { WorkSurface } from "#/components/ToolShell";
import { toolHead } from "#/lib/seo";

export const Route = createFileRoute("/tools/http-headers")({
	head: () => toolHead("http-headers"),
	component: HttpHeaders,
});

interface ParsedHeaders {
	firstLine: string | null;
	headers: Record<string, string>;
}

function HttpHeaders() {
	const [input, setInput] = useState("");
	const parsed = useMemo<ParsedHeaders | null>(() => {
		if (!input.trim()) return null;
		const lines = input.trim().split("\n");
		const headers: Record<string, string> = {};
		let firstLine: string | null = null;
		for (const line of lines) {
			const m = line.match(/^([^:]+):\s*(.*)$/);
			if (m) {
				headers[m[1].trim()] = m[2].trim();
			} else if (!firstLine && line.includes("HTTP")) firstLine = line.trim();
		}
		return { firstLine, headers };
	}, [input]);

	return (
		<ToolShell
			toolId="http-headers"
			title="HTTP Headers"
			description="Format and inspect headers"
			runsLocally
		>
			<WorkSurface
				label="raw headers"
				value={input}
				onChange={(e) => setInput(e.target.value)}
				placeholder={
					"Content-Type: application/json\nAuthorization: Bearer token"
				}
				rows={6}
			/>
			{parsed && (
				<div className="border border-rule bg-surface">
					{parsed.firstLine && (
						<div className="font-mono text-xs px-3.5 py-2 border-b border-rule text-accent">
							{parsed.firstLine}
						</div>
					)}
					{Object.entries(parsed.headers).map(([k, v]) => (
						<div
							key={k}
							className="flex items-baseline gap-3 px-3.5 py-2 border-b border-rule last:border-b-0"
						>
							<span className="font-mono text-xs text-muted w-40 shrink-0">
								{k}
							</span>
							<span className="font-mono text-xs break-all">{v}</span>
						</div>
					))}
					{Object.keys(parsed.headers).length === 0 && (
						<div className="font-mono text-xs text-muted px-3.5 py-3">
							no headers found
						</div>
					)}
				</div>
			)}
		</ToolShell>
	);
}
