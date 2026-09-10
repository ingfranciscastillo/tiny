import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";

import ToolShell, { OutputBlock, WorkSurface } from "#/components/ToolShell";
import { toolHead } from "#/lib/seo";

export const Route = createFileRoute("/tools/base64-url")({
	head: () => toolHead("base64url"),
	component: Base64Url,
});

function b64urlEncode(str: string): string {
	const bytes = new TextEncoder().encode(str);
	const bin = Array.from(bytes, (b) => String.fromCharCode(b)).join("");
	const b64 = btoa(bin);
	return b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function b64urlDecode(str: string): string {
	const b64 = str.replace(/-/g, "+").replace(/_/g, "/");
	const pad = b64.length % 4 === 2 ? "==" : b64.length % 4 === 3 ? "=" : "";
	const bin = atob(b64 + pad);
	const bytes = Uint8Array.from(bin, (c) => c.charCodeAt(0));
	return new TextDecoder().decode(bytes);
}

type Mode = "encode" | "decode";

function Base64Url() {
	const [mode, setMode] = useState<Mode>("encode");
	const [input, setInput] = useState("");
	const output = useMemo(() => {
		if (!input) return "";
		try {
			return mode === "encode" ? b64urlEncode(input) : b64urlDecode(input);
		} catch {
			return "decode error";
		}
	}, [input, mode]);

	return (
		<ToolShell
			toolId="base64url"
			title="Base64 URL"
			description="URL-safe Base64"
			runsLocally
		>
			<div className="flex items-center gap-1">
				{(["encode", "decode"] as const).map((m) => (
					<button
						key={m}
						type="button"
						onClick={() => setMode(m)}
						className={`font-mono text-xs uppercase tracking-wide px-3 py-1.5 border border-rule transition-tiny ${
							mode === m ? "bg-accent-soft text-accent" : "hover:text-accent"
						}`}
					>
						{m}
					</button>
				))}
			</div>
			<WorkSurface
				label="input"
				value={input}
				onChange={(e) => setInput(e.target.value)}
				placeholder={mode === "encode" ? "text" : "encoded"}
				rows={5}
			/>
			<OutputBlock
				value={output}
				placeholder="url-safe base64"
				copyLabel="Copy"
			/>
		</ToolShell>
	);
}
