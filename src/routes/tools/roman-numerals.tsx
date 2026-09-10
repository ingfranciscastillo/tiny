import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";

import ToolShell from "#/components/ToolShell";
import { toolHead } from "#/lib/seo";

export const Route = createFileRoute("/tools/roman-numerals")({
	head: () => toolHead("roman-numerals"),
	component: RomanNumerals,
});

const ROMAN: [string, number][] = [
	["M", 1000],
	["CM", 900],
	["D", 500],
	["CD", 400],
	["C", 100],
	["XC", 90],
	["L", 50],
	["XL", 40],
	["X", 10],
	["IX", 9],
	["V", 5],
	["IV", 4],
	["I", 1],
];

function toRoman(n: number): string | null {
	if (n < 1 || n > 3999) return null;
	let r = "";
	for (const [s, v] of ROMAN) {
		while (n >= v) {
			r += s;
			n -= v;
		}
	}
	return r;
}

const ROMAN_VALUES: Record<string, number> = {
	I: 1,
	V: 5,
	X: 10,
	L: 50,
	C: 100,
	D: 500,
	M: 1000,
};

function fromRoman(s: string): number | null {
	let n = 0;
	for (let i = 0; i < s.length; i++) {
		const cur = ROMAN_VALUES[s[i]];
		const next = ROMAN_VALUES[s[i + 1]];
		if (!cur) return null;
		n += next && cur < next ? -cur : cur;
	}
	return n;
}

type Mode = "toRoman" | "fromRoman";

const MODES: [Mode, string][] = [
	["toRoman", "Number → Roman"],
	["fromRoman", "Roman → Number"],
];

function RomanNumerals() {
	const [mode, setMode] = useState<Mode>("toRoman");
	const [input, setInput] = useState("2024");
	const result = useMemo(() => {
		if (!input.trim()) return null;
		if (mode === "toRoman") {
			const n = Number.parseInt(input, 10);
			return Number.isNaN(n) ? null : toRoman(n);
		}
		return fromRoman(input.toUpperCase());
	}, [input, mode]);

	return (
		<ToolShell
			toolId="roman-numerals"
			title="Roman Numerals"
			description="Number ↔ Roman numerals"
			runsLocally
		>
			<div className="flex items-center gap-1">
				{MODES.map(([m, l]) => (
					<button
						key={m}
						type="button"
						onClick={() => {
							setMode(m);
							setInput(m === "toRoman" ? "2024" : "MMXXIV");
						}}
						className={`font-mono text-xs uppercase tracking-wide px-3 py-1.5 border border-rule transition-tiny ${
							mode === m ? "bg-accent-soft text-accent" : "hover:text-accent"
						}`}
					>
						{l}
					</button>
				))}
			</div>
			<div>
				<label
					htmlFor="roman-input"
					className="font-mono text-[11px] uppercase tracking-wide text-muted block mb-1.5"
				>
					{mode === "toRoman" ? "number (1-3999)" : "roman numeral"}
				</label>
				<input
					id="roman-input"
					value={input}
					onChange={(e) => setInput(e.target.value)}
					spellCheck={false}
					className="w-full font-mono text-sm bg-surface border border-rule rounded-none px-3.5 py-3 focus:outline-none focus:border-accent transition-tiny"
				/>
			</div>
			{result != null && (
				<div className="border border-rule bg-surface px-3.5 py-3 flex items-center justify-between">
					<span className="font-mono text-sm text-muted">result</span>
					<span className="font-mono text-2xl">{result}</span>
				</div>
			)}
			{result == null && input && (
				<div className="font-mono text-xs text-accent border-l-2 border-accent pl-3 py-1">
					invalid input
				</div>
			)}
		</ToolShell>
	);
}
