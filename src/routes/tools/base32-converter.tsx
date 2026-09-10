import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";

import ToolShell, { OutputBlock, WorkSurface } from "#/components/ToolShell";
import { toolHead } from "#/lib/seo";

export const Route = createFileRoute("/tools/base32-converter")({
	head: () => toolHead("base32"),
	component: Base32,
});

const ALPHA = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
const PAD = "=";

function encode32(str: string): string {
	const bytes = new TextEncoder().encode(str);
	let bits = 0;
	let value = 0;
	let out = "";
	for (const b of bytes) {
		value = (value << 8) | b;
		bits += 8;
		while (bits >= 5) {
			out += ALPHA[(value >>> (bits - 5)) & 31];
			bits -= 5;
		}
	}
	if (bits > 0) out += ALPHA[(value << (5 - bits)) & 31];
	while (out.length % 8 !== 0) out += PAD;
	return out;
}

function decode32(str: string): string {
	const clean = str
		.replace(/=+$/g, "")
		.toUpperCase()
		.replace(/[^A-Z2-7]/g, "");
	let bits = 0;
	let value = 0;
	const out: number[] = [];
	for (const c of clean) {
		const idx = ALPHA.indexOf(c);
		if (idx < 0) continue;
		value = (value << 5) | idx;
		bits += 5;
		if (bits >= 8) {
			out.push((value >>> (bits - 8)) & 255);
			bits -= 8;
		}
	}
	return new TextDecoder().decode(Uint8Array.from(out));
}

type Mode = "encode" | "decode";

function Base32() {
	const [mode, setMode] = useState<Mode>("encode");
	const [input, setInput] = useState("");
	const output = useMemo(() => {
		if (!input) return "";
		try {
			return mode === "encode" ? encode32(input) : decode32(input);
		} catch {
			return "decode error";
		}
	}, [input, mode]);

	return (
		<ToolShell
			toolId="base32"
			title="Base32"
			description="Encode / decode Base32"
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
				placeholder="base32 output"
				copyLabel="Copy"
			/>
		</ToolShell>
	);
}
