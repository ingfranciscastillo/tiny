import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import ToolShell from "#/components/ToolShell";
import { toolHead } from "#/lib/seo";

export const Route = createFileRoute("/tools/hash-generator")({
	head: () => toolHead("hash"),
	component: HashGenerator,
});

const ALGOS = ["SHA-1", "SHA-256", "SHA-384", "SHA-512"] as const;

function HashGenerator() {
	const [input, setInput] = useState("");
	const [hashes, setHashes] = useState<Record<string, string>>({});

	useEffect(() => {
		if (!input) {
			setHashes({});
			return;
		}
		let cancelled = false;
		(async () => {
			const data = new TextEncoder().encode(input);
			const out: Record<string, string> = {};
			for (const a of ALGOS) {
				const buf = await crypto.subtle.digest(a, data);
				out[a] = Array.from(new Uint8Array(buf))
					.map((b) => b.toString(16).padStart(2, "0"))
					.join("");
			}
			if (!cancelled) setHashes(out);
		})();
		return () => {
			cancelled = true;
		};
	}, [input]);

	return (
		<ToolShell
			toolId="hash"
			title="Hash Generator"
			description="Compute SHA-1, SHA-256, SHA-384, SHA-512"
			runsLocally
		>
			<div>
				<label
					htmlFor="hash-input"
					className="font-mono text-[11px] uppercase tracking-wide text-muted block mb-1.5"
				>
					input
				</label>
				<textarea
					id="hash-input"
					value={input}
					onChange={(e) => setInput(e.target.value)}
					spellCheck={false}
					rows={5}
					placeholder="text to hash"
					className="w-full font-mono text-sm leading-relaxed bg-surface border border-rule rounded-none px-3.5 py-3 resize-y focus:outline-none focus:border-accent transition-tiny placeholder:text-muted/50"
				/>
			</div>
			<div className="space-y-3">
				{Object.keys(hashes).length === 0 && input && (
					<div className="font-mono text-xs text-muted">hashing…</div>
				)}
				{Object.entries(hashes).map(([algo, hex]) => (
					<div key={algo}>
						<div className="font-mono text-[11px] uppercase tracking-wide text-muted mb-1">
							{algo}
						</div>
						<div className="font-mono text-xs bg-surface border border-rule px-3.5 py-2.5 break-all">
							{hex}
						</div>
					</div>
				))}
			</div>
		</ToolShell>
	);
}
