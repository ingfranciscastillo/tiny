import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";

import ToolShell from "#/components/ToolShell";
import { toolHead } from "#/lib/seo";

export const Route = createFileRoute("/tools/url-parser")({
	head: () => toolHead("url-parser"),
	component: UrlParser,
});

interface ParsedUrl {
	protocol: string;
	hostname: string;
	port: string;
	pathname: string;
	search: string;
	hash: string;
	params: Record<string, string>;
}

function UrlParser() {
	const [input, setInput] = useState(
		"https://example.com/path?key=value#anchor",
	);
	const parsed = useMemo<ParsedUrl | null>(() => {
		if (!input.trim()) return null;
		try {
			const u = new URL(input);
			const params: Record<string, string> = {};
			u.searchParams.forEach((v, k) => {
				params[k] = v;
			});
			return {
				protocol: u.protocol,
				hostname: u.hostname,
				port: u.port,
				pathname: u.pathname,
				search: u.search,
				hash: u.hash,
				params,
			};
		} catch {
			return null;
		}
	}, [input]);

	return (
		<ToolShell
			toolId="url-parser"
			title="URL Parser"
			description="Break a URL into components"
			runsLocally
		>
			<div>
				<label
					htmlFor="url-parser-input"
					className="font-mono text-[11px] uppercase tracking-wide text-muted block mb-1.5"
				>
					url
				</label>
				<input
					id="url-parser-input"
					value={input}
					onChange={(e) => setInput(e.target.value)}
					spellCheck={false}
					className="w-full font-mono text-sm bg-surface border border-rule rounded-none px-3.5 py-3 focus:outline-none focus:border-accent transition-tiny"
				/>
			</div>
			{parsed ? (
				<div className="border border-rule bg-surface divide-y divide-border">
					{(
						[
							["protocol", parsed.protocol],
							["hostname", parsed.hostname],
							["port", parsed.port || "—"],
							["path", parsed.pathname],
							["query", parsed.search || "—"],
							["hash", parsed.hash || "—"],
						] as const
					).map(([k, v]) => (
						<div
							key={k}
							className="flex items-center justify-between px-3.5 py-2.5"
						>
							<span className="font-mono text-[10px] uppercase tracking-wide text-muted w-20">
								{k}
							</span>
							<span className="font-mono text-sm flex-1 break-all">{v}</span>
						</div>
					))}
					{Object.keys(parsed.params).length > 0 && (
						<div className="px-3.5 py-2.5">
							<div className="font-mono text-[10px] uppercase tracking-wide text-muted mb-1.5">
								query params
							</div>
							{Object.entries(parsed.params).map(([k, v]) => (
								<div key={k} className="font-mono text-sm flex gap-2 py-0.5">
									<span className="text-muted">{k}:</span> <span>{v}</span>
								</div>
							))}
						</div>
					)}
				</div>
			) : (
				input && (
					<div className="font-mono text-xs text-accent border-l-2 border-accent pl-3 py-1">
						invalid URL
					</div>
				)
			)}
		</ToolShell>
	);
}
