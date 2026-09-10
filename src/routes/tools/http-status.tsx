import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";

import ToolShell from "#/components/ToolShell";
import { toolHead } from "#/lib/seo";

export const Route = createFileRoute("/tools/http-status")({
	head: () => toolHead("http-status"),
	component: HttpStatus,
});

const STATUS: Record<string, { label: string; color: string }> = {
	"1xx": { label: "Informational", color: "text-muted" },
	"2xx": { label: "Success", color: "text-accent" },
	"3xx": { label: "Redirection", color: "text-accent" },
	"4xx": { label: "Client Error", color: "text-accent" },
	"5xx": { label: "Server Error", color: "text-accent" },
};

const CODES: Record<number, string> = {
	100: "Continue",
	101: "Switching Protocols",
	102: "Processing",
	200: "OK",
	201: "Created",
	202: "Accepted",
	204: "No Content",
	206: "Partial Content",
	301: "Moved Permanently",
	302: "Found",
	304: "Not Modified",
	307: "Temporary Redirect",
	308: "Permanent Redirect",
	400: "Bad Request",
	401: "Unauthorized",
	403: "Forbidden",
	404: "Not Found",
	405: "Method Not Allowed",
	408: "Request Timeout",
	409: "Conflict",
	410: "Gone",
	418: "I'm a Teapot",
	429: "Too Many Requests",
	500: "Internal Server Error",
	501: "Not Implemented",
	502: "Bad Gateway",
	503: "Service Unavailable",
	504: "Gateway Timeout",
};

function HttpStatus() {
	const [query, setQuery] = useState("");
	const results = useMemo(() => {
		const q = query.trim();
		if (!q) return Object.entries(CODES);
		return Object.entries(CODES).filter(
			([code, desc]) =>
				code.includes(q) || desc.toLowerCase().includes(q.toLowerCase()),
		);
	}, [query]);

	return (
		<ToolShell
			toolId="http-status"
			title="HTTP Status"
			description="Explain HTTP status codes"
			runsLocally
		>
			<input
				value={query}
				onChange={(e) => setQuery(e.target.value)}
				placeholder="search code or description"
				spellCheck={false}
				className="w-full font-mono text-sm bg-surface border border-rule rounded-none px-3.5 py-3 focus:outline-none focus:border-accent transition-tiny"
			/>
			<div className="border-t border-rule">
				{results.map(([code, desc]) => {
					const cls = STATUS[`${code[0]}xx`];
					return (
						<div
							key={code}
							className="flex items-baseline gap-4 border-b border-rule py-2.5 px-1"
						>
							<span
								className={`font-mono text-sm font-medium w-12 ${cls?.color || ""}`}
							>
								{code}
							</span>
							<span className="font-mono text-[10px] uppercase tracking-wide text-muted w-24">
								{cls?.label}
							</span>
							<span className="text-sm">{desc}</span>
						</div>
					);
				})}
				{results.length === 0 && (
					<div className="font-mono text-sm text-muted py-4 px-1">
						no matches
					</div>
				)}
			</div>
		</ToolShell>
	);
}
