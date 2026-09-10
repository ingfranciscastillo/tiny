import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";

import ToolShell, { OutputBlock } from "#/components/ToolShell";
import { toolHead } from "#/lib/seo";

export const Route = createFileRoute("/tools/url-builder")({
	head: () => toolHead("url-builder"),
	component: UrlBuilder,
});

function UrlBuilder() {
	const [protocol, setProtocol] = useState("https");
	const [host, setHost] = useState("example.com");
	const [path, setPath] = useState("/path");
	const [query, setQuery] = useState("key=value");
	const [hash, setHash] = useState("");
	const output = useMemo(() => {
		let url = `${protocol}://${host}`;
		if (path && !path.startsWith("/")) url += `/${path}`;
		else if (path) url += path;
		if (query) url += `?${query}`;
		if (hash) url += `#${hash}`;
		return url;
	}, [protocol, host, path, query, hash]);

	return (
		<ToolShell
			toolId="url-builder"
			title="URL Builder"
			description="Build URLs from components"
			runsLocally
		>
			<div className="space-y-3">
				<div className="flex items-end gap-3">
					<div>
						<label
							htmlFor="url-builder-protocol"
							className="font-mono text-[11px] uppercase tracking-wide text-muted block mb-1.5"
						>
							protocol
						</label>
						<select
							id="url-builder-protocol"
							value={protocol}
							onChange={(e) => setProtocol(e.target.value)}
							className="font-mono text-sm bg-surface border border-rule rounded-none px-3 py-2 focus:outline-none focus:border-accent transition-tiny"
						>
							<option value="https">https</option>
							<option value="http">http</option>
							<option value="ftp">ftp</option>
						</select>
					</div>
					<div className="flex-1">
						<label
							htmlFor="url-builder-host"
							className="font-mono text-[11px] uppercase tracking-wide text-muted block mb-1.5"
						>
							host
						</label>
						<input
							id="url-builder-host"
							value={host}
							onChange={(e) => setHost(e.target.value)}
							spellCheck={false}
							className="w-full font-mono text-sm bg-surface border border-rule rounded-none px-3 py-2 focus:outline-none focus:border-accent transition-tiny"
						/>
					</div>
				</div>
				<div>
					<label
						htmlFor="url-builder-path"
						className="font-mono text-[11px] uppercase tracking-wide text-muted block mb-1.5"
					>
						path
					</label>
					<input
						id="url-builder-path"
						value={path}
						onChange={(e) => setPath(e.target.value)}
						spellCheck={false}
						className="w-full font-mono text-sm bg-surface border border-rule rounded-none px-3 py-2 focus:outline-none focus:border-accent transition-tiny"
					/>
				</div>
				<div className="grid grid-cols-2 gap-3">
					<div>
						<label
							htmlFor="url-builder-query"
							className="font-mono text-[11px] uppercase tracking-wide text-muted block mb-1.5"
						>
							query
						</label>
						<input
							id="url-builder-query"
							value={query}
							onChange={(e) => setQuery(e.target.value)}
							spellCheck={false}
							className="w-full font-mono text-sm bg-surface border border-rule rounded-none px-3 py-2 focus:outline-none focus:border-accent transition-tiny"
						/>
					</div>
					<div>
						<label
							htmlFor="url-builder-hash"
							className="font-mono text-[11px] uppercase tracking-wide text-muted block mb-1.5"
						>
							hash
						</label>
						<input
							id="url-builder-hash"
							value={hash}
							onChange={(e) => setHash(e.target.value)}
							spellCheck={false}
							className="w-full font-mono text-sm bg-surface border border-rule rounded-none px-3 py-2 focus:outline-none focus:border-accent transition-tiny"
						/>
					</div>
				</div>
			</div>
			<OutputBlock
				value={output}
				placeholder="https://example.com/path?key=value"
				copyLabel="Copy"
			/>
		</ToolShell>
	);
}
