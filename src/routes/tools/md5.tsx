import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";

import ToolShell, { OutputBlock, WorkSurface } from "#/components/ToolShell";
import { toolHead } from "#/lib/seo";

export const Route = createFileRoute("/tools/md5")({
	head: () => toolHead("md5"),
	component: Md5,
});

const K = Array.from(
	{ length: 64 },
	(_, i) => Math.floor(Math.abs(Math.sin(i + 1)) * 2 ** 32) | 0,
);
const S = [
	7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22, 5, 9, 14, 20, 5,
	9, 14, 20, 5, 9, 14, 20, 5, 9, 14, 20, 4, 11, 16, 23, 4, 11, 16, 23, 4, 11,
	16, 23, 4, 11, 16, 23, 6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15,
	21,
];

function rotl(x: number, c: number): number {
	return (x << c) | (x >>> (32 - c));
}

function toHexLE(n: number): string {
	let s = "";
	for (let i = 0; i < 4; i++)
		s += ((n >>> (i * 8)) & 0xff).toString(16).padStart(2, "0");
	return s;
}

function md5(input: string): string {
	const bytes = new TextEncoder().encode(input);
	const bitLen = bytes.length * 8;
	const padded = [...bytes, 0x80];
	while (padded.length % 64 !== 56) padded.push(0);
	for (let i = 0; i < 8; i++)
		padded.push(Math.floor(bitLen / 2 ** (8 * i)) & 0xff);

	let a0 = 0x67452301;
	let b0 = 0xefcdab89;
	let c0 = 0x98badcfe;
	let d0 = 0x10325476;

	for (let chunkStart = 0; chunkStart < padded.length; chunkStart += 64) {
		const m: number[] = [];
		for (let j = 0; j < 16; j++) {
			const o = chunkStart + j * 4;
			m[j] =
				padded[o] |
				(padded[o + 1] << 8) |
				(padded[o + 2] << 16) |
				(padded[o + 3] << 24);
		}

		let a = a0;
		let b = b0;
		let c = c0;
		let d = d0;
		for (let i = 0; i < 64; i++) {
			let f: number;
			let g: number;
			if (i < 16) {
				f = (b & c) | (~b & d);
				g = i;
			} else if (i < 32) {
				f = (d & b) | (~d & c);
				g = (5 * i + 1) % 16;
			} else if (i < 48) {
				f = b ^ c ^ d;
				g = (3 * i + 5) % 16;
			} else {
				f = c ^ (b | ~d);
				g = (7 * i) % 16;
			}
			f = (f + a + K[i] + m[g]) | 0;
			a = d;
			d = c;
			c = b;
			b = (b + rotl(f, S[i])) | 0;
		}

		a0 = (a0 + a) | 0;
		b0 = (b0 + b) | 0;
		c0 = (c0 + c) | 0;
		d0 = (d0 + d) | 0;
	}

	return toHexLE(a0) + toHexLE(b0) + toHexLE(c0) + toHexLE(d0);
}

function Md5() {
	const [input, setInput] = useState("");
	const output = useMemo(() => (input ? md5(input) : ""), [input]);
	return (
		<ToolShell
			toolId="md5"
			title="MD5"
			description="Generate MD5 hashes"
			runsLocally
		>
			<WorkSurface
				label="input"
				value={input}
				onChange={(e) => setInput(e.target.value)}
				placeholder="text to hash"
				rows={5}
			/>
			<OutputBlock value={output} placeholder="md5 hash" copyLabel="Copy" />
		</ToolShell>
	);
}
