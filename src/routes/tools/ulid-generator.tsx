import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import ToolShell, { OutputBlock } from "#/components/ToolShell";
import { toolHead } from "#/lib/seo";

export const Route = createFileRoute("/tools/ulid-generator")({
	head: () => toolHead("ulid"),
	component: UlidGenerator,
});

const ALPHABET = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";

// Base32-encode the 48-bit ms timestamp via division, not bitwise shifts —
// `>>>` coerces to a 32-bit int first, which silently truncates any
// timestamp past 1970 + ~49 days (i.e. always, in practice).
function encodeTime(time: number, len: number): string {
	let str = "";
	for (let i = len - 1; i >= 0; i--) {
		const mod = time % 32;
		str = ALPHABET[mod] + str;
		time = (time - mod) / 32;
	}
	return str;
}

function ulid(): string {
	const ts = encodeTime(Date.now(), 10);
	let rand = "";
	const arr = new Uint8Array(16);
	crypto.getRandomValues(arr);
	for (let i = 0; i < 16; i++) rand += ALPHABET[arr[i] & 31];
	return ts + rand;
}

function UlidGenerator() {
	const [count, setCount] = useState(5);
	const [output, setOutput] = useState("");

	const generate = () => {
		setOutput(
			Array.from({ length: Math.min(50, count) }, () => ulid()).join("\n"),
		);
	};

	return (
		<ToolShell
			toolId="ulid"
			title="ULID Generator"
			description="Generate ULIDs"
			runsLocally
		>
			<div className="flex items-end gap-3">
				<div>
					<label
						htmlFor="ulid-count"
						className="font-mono text-[11px] uppercase tracking-wide text-muted block mb-1.5"
					>
						count
					</label>
					<input
						id="ulid-count"
						type="number"
						min="1"
						max="50"
						value={count}
						onChange={(e) => setCount(Number(e.target.value))}
						className="w-24 font-mono text-sm bg-surface border border-rule rounded-none px-3 py-2 focus:outline-none focus:border-accent transition-tiny"
					/>
				</div>
				<button
					type="button"
					onClick={generate}
					className="font-mono text-xs uppercase tracking-wide px-3 py-2 border border-rule rounded-none transition-tiny hover:text-accent hover:border-accent"
				>
					Generate
				</button>
			</div>
			<OutputBlock value={output} placeholder="01H..." copyLabel="Copy" />
		</ToolShell>
	);
}
