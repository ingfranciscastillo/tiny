import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";

import CopyButton from "#/components/CopyButton";
import ToolShell from "#/components/ToolShell";
import { toolHead } from "#/lib/seo";

export const Route = createFileRoute("/tools/mac-formatter")({
	head: () => toolHead("mac-formatter"),
	component: MacFormatter,
});

function formatMac(mac: string, sep: string): string | null {
	const clean = mac.replace(/[^0-9a-fA-F]/g, "").toUpperCase();
	if (clean.length !== 12) return null;
	return clean.match(/.{2}/g)?.join(sep) ?? null;
}

function MacFormatter() {
	const [input, setInput] = useState("001122334455");
	const [sep, setSep] = useState(":");
	const output = useMemo(
		() => (input ? formatMac(input, sep) : null),
		[input, sep],
	);

	return (
		<ToolShell
			toolId="mac-formatter"
			title="MAC Formatter"
			description="Normalize MAC addresses"
			runsLocally
		>
			<div className="flex items-end gap-3">
				<div className="flex-1">
					<label
						htmlFor="mac-input"
						className="font-mono text-[11px] uppercase tracking-wide text-muted block mb-1.5"
					>
						mac address
					</label>
					<input
						id="mac-input"
						value={input}
						onChange={(e) => setInput(e.target.value)}
						spellCheck={false}
						className="w-full font-mono text-sm bg-surface border border-rule rounded-none px-3 py-2 focus:outline-none focus:border-accent transition-tiny"
					/>
				</div>
				<div>
					<label
						htmlFor="mac-sep"
						className="font-mono text-[11px] uppercase tracking-wide text-muted block mb-1.5"
					>
						separator
					</label>
					<select
						id="mac-sep"
						value={sep}
						onChange={(e) => setSep(e.target.value)}
						className="font-mono text-sm bg-surface border border-rule rounded-none px-3 py-2 focus:outline-none focus:border-accent transition-tiny"
					>
						<option value=":">:</option>
						<option value="-">-</option>
						<option value="">none</option>
					</select>
				</div>
			</div>
			{output ? (
				<div className="border border-rule bg-surface px-3.5 py-3 flex items-center justify-between">
					<span className="font-mono text-sm">{output}</span>
					<CopyButton value={output} label="copy" />
				</div>
			) : (
				input && (
					<div className="font-mono text-xs text-accent border-l-2 border-accent pl-3 py-1">
						invalid MAC (need 12 hex digits)
					</div>
				)
			)}
		</ToolShell>
	);
}
