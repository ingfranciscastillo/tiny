import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";

import CopyButton from "#/components/CopyButton";
import ToolShell from "#/components/ToolShell";
import { toolHead } from "#/lib/seo";

export const Route = createFileRoute("/tools/mime-lookup")({
	head: () => toolHead("mime-lookup"),
	component: MimeLookup,
});

const MIME: Record<string, string> = {
	html: "text/html",
	htm: "text/html",
	css: "text/css",
	js: "text/javascript",
	mjs: "text/javascript",
	json: "application/json",
	xml: "application/xml",
	txt: "text/plain",
	md: "text/markdown",
	csv: "text/csv",
	jpg: "image/jpeg",
	jpeg: "image/jpeg",
	png: "image/png",
	gif: "image/gif",
	svg: "image/svg+xml",
	webp: "image/webp",
	ico: "image/x-icon",
	bmp: "image/bmp",
	mp3: "audio/mpeg",
	wav: "audio/wav",
	ogg: "audio/ogg",
	mp4: "video/mp4",
	webm: "video/webm",
	pdf: "application/pdf",
	zip: "application/zip",
	gz: "application/gzip",
	tar: "application/x-tar",
	doc: "application/msword",
	docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
	xls: "application/vnd.ms-excel",
	xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
	ppt: "application/vnd.ms-powerpoint",
	pptx: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
	woff: "font/woff",
	woff2: "font/woff2",
	ttf: "font/ttf",
	otf: "font/otf",
	eot: "application/vnd.ms-fontobject",
};

function MimeLookup() {
	const [query, setQuery] = useState("");
	const results = useMemo(() => {
		const q = query.trim().toLowerCase().replace(/^\./, "");
		if (!q) return Object.entries(MIME);
		return Object.entries(MIME).filter(
			([ext, mime]) => ext.includes(q) || mime.includes(q),
		);
	}, [query]);

	return (
		<ToolShell
			toolId="mime-lookup"
			title="MIME Lookup"
			description="Find MIME type from extension"
			runsLocally
		>
			<input
				value={query}
				onChange={(e) => setQuery(e.target.value)}
				placeholder="search extension or type"
				spellCheck={false}
				className="w-full font-mono text-sm bg-surface border border-rule rounded-none px-3.5 py-3 focus:outline-none focus:border-accent transition-tiny"
			/>
			<div className="border-t border-rule">
				{results.map(([ext, mime]) => (
					<div
						key={ext}
						className="flex items-center justify-between border-b border-rule py-2.5 px-1"
					>
						<span className="font-mono text-sm">.{ext}</span>
						<span className="flex items-center gap-2">
							<span className="font-mono text-sm text-muted">{mime}</span>
							<CopyButton value={mime} label="copy" />
						</span>
					</div>
				))}
				{results.length === 0 && (
					<div className="font-mono text-sm text-muted py-4 px-1">
						no matches
					</div>
				)}
			</div>
		</ToolShell>
	);
}
