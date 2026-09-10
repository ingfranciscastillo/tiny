import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";

import ToolShell, { OutputBlock, WorkSurface } from "#/components/ToolShell";
import { toolHead } from "#/lib/seo";

export const Route = createFileRoute("/tools/base58-converter")({
	head: () => toolHead("base58"),
	component: Base58,
});

const ALPHABET = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";

function encode58(str: string): string {
	const bytes = new TextEncoder().encode(str);
	if (bytes.length === 0) return "";
	let leadingZeros = 0;
	while (leadingZeros < bytes.length && bytes[leadingZeros] === 0)
		leadingZeros++;
	const digits: number[] = [];
	for (let i = leadingZeros; i < bytes.length; i++) {
		let carry = bytes[i];
		let j = 0;
		for (let k = digits.length - 1; k >= 0 || carry; k--, j--) {
			if (k >= 0) carry += digits[k] * 256;
			digits[k] = carry % 58;
			carry = Math.floor(carry / 58);
		}
		while (j++ > 0) digits.unshift(0);
	}
	let out = "1".repeat(leadingZeros);
	for (const d of digits) out += ALPHABET[d];
	return out;
}

function decode58(str: string): string {
	const bytes: number[] = [];
	let leadingZeros = 0;
	while (leadingZeros < str.length && str[leadingZeros] === "1") leadingZeros++;
	const b58: number[] = [];
	for (const c of str) {
		const idx = ALPHABET.indexOf(c);
		if (idx < 0) throw new Error("invalid char");
		let carry = idx;
		for (let k = 0; k < b58.length; k++) {
			carry += b58[k] * 58;
			b58[k] = carry & 255;
			carry >>= 8;
		}
		while (carry > 0) {
			b58.push(carry & 255);
			carry >>= 8;
		}
	}
	for (let i = 0; i < leadingZeros; i++) bytes.push(0);
	bytes.push(...b58.reverse());
	return new TextDecoder().decode(Uint8Array.from(bytes));
}

type Mode = "encode" | "decode";

function Base58() {
	const [mode, setMode] = useState<Mode>("encode");
	const [input, setInput] = useState("");
	const output = useMemo(() => {
		if (!input) return "";
		try {
			return mode === "encode" ? encode58(input) : decode58(input);
		} catch {
			return "decode error";
		}
	}, [input, mode]);

	return (
		<ToolShell
			toolId="base58"
			title="Base58"
			description="Encode / decode Base58"
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
				placeholder="base58 output"
				copyLabel="Copy"
			/>
		</ToolShell>
	);
}
