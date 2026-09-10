import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import ToolShell, { OutputBlock, WorkSurface } from "#/components/ToolShell";
import { toolHead } from "#/lib/seo";

export const Route = createFileRoute("/tools/hmac-generator")({
	head: () => toolHead("hmac-generator"),
	component: HmacGenerator,
});

const ALGOS = ["SHA-1", "SHA-256", "SHA-384", "SHA-512"] as const;
type Algo = (typeof ALGOS)[number];

function HmacGenerator() {
	const [message, setMessage] = useState("");
	const [key, setKey] = useState("");
	const [algo, setAlgo] = useState<Algo>("SHA-256");
	const [output, setOutput] = useState("");

	useEffect(() => {
		if (!message || !key) {
			setOutput("");
			return;
		}
		let cancelled = false;
		(async () => {
			try {
				const enc = new TextEncoder();
				const keyData = await crypto.subtle.importKey(
					"raw",
					enc.encode(key),
					{ name: "HMAC", hash: algo },
					false,
					["sign"],
				);
				const sig = await crypto.subtle.sign(
					"HMAC",
					keyData,
					enc.encode(message),
				);
				const hex = Array.from(new Uint8Array(sig))
					.map((b) => b.toString(16).padStart(2, "0"))
					.join("");
				if (!cancelled) setOutput(hex);
			} catch {
				if (!cancelled) setOutput("error");
			}
		})();
		return () => {
			cancelled = true;
		};
	}, [message, key, algo]);

	return (
		<ToolShell
			toolId="hmac-generator"
			title="HMAC Generator"
			description="Generate HMAC signatures"
			runsLocally
		>
			<div className="flex items-center gap-2">
				<span className="font-mono text-[11px] uppercase tracking-wide text-muted">
					algorithm
				</span>
				{ALGOS.map((a) => (
					<button
						key={a}
						type="button"
						onClick={() => setAlgo(a)}
						className={`font-mono text-xs px-2.5 py-1 border border-rule transition-tiny ${
							algo === a ? "bg-accent-soft text-accent" : "hover:text-accent"
						}`}
					>
						{a}
					</button>
				))}
			</div>
			<div>
				<label
					htmlFor="hmac-key"
					className="font-mono text-[11px] uppercase tracking-wide text-muted block mb-1.5"
				>
					key
				</label>
				<input
					id="hmac-key"
					value={key}
					onChange={(e) => setKey(e.target.value)}
					spellCheck={false}
					className="w-full font-mono text-sm bg-surface border border-rule rounded-none px-3.5 py-2.5 focus:outline-none focus:border-accent transition-tiny"
				/>
			</div>
			<WorkSurface
				label="message"
				value={message}
				onChange={(e) => setMessage(e.target.value)}
				placeholder="text to sign"
				rows={4}
			/>
			<OutputBlock
				value={output}
				placeholder="hmac signature"
				copyLabel="Copy"
			/>
		</ToolShell>
	);
}
