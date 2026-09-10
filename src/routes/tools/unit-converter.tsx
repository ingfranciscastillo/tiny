import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";

import ToolShell from "#/components/ToolShell";
import { toolHead } from "#/lib/seo";

export const Route = createFileRoute("/tools/unit-converter")({
	head: () => toolHead("unit-converter"),
	component: UnitConverter,
});

const LENGTH: Record<string, number> = {
	mm: 1,
	cm: 10,
	m: 1000,
	km: 1000000,
	in: 25.4,
	ft: 304.8,
	yd: 914.4,
	mi: 1609344,
};
const WEIGHT: Record<string, number> = {
	mg: 1,
	g: 1000,
	kg: 1000000,
	oz: 28349.5,
	lb: 453592,
	t: 1000000000,
};
const TEMP = ["C", "F", "K"] as const;

type Category = "length" | "weight" | "temperature";

const CATEGORIES: [Category, string][] = [
	["length", "length"],
	["weight", "weight"],
	["temperature", "temp"],
];

function unitsFor(c: Category): string[] {
	if (c === "length") return Object.keys(LENGTH);
	if (c === "weight") return Object.keys(WEIGHT);
	return [...TEMP];
}

function convertTemp(v: number, from: string, to: string): number {
	let c: number;
	if (from === "C") c = v;
	else if (from === "F") c = ((v - 32) * 5) / 9;
	else c = v - 273.15;
	if (to === "C") return c;
	if (to === "F") return (c * 9) / 5 + 32;
	return c + 273.15;
}

function UnitConverter() {
	const [category, setCategory] = useState<Category>("length");
	const [value, setValue] = useState("1");
	const [from, setFrom] = useState("m");
	const [to, setTo] = useState("ft");

	const units = unitsFor(category);
	const result = useMemo(() => {
		const v = Number.parseFloat(value);
		if (Number.isNaN(v)) return null;
		if (category === "temperature") return convertTemp(v, from, to);
		const table = category === "length" ? LENGTH : WEIGHT;
		return (v * table[from]) / table[to];
	}, [value, from, to, category]);

	const switchCategory = (c: Category) => {
		setCategory(c);
		const u = unitsFor(c);
		setFrom(u[0]);
		setTo(u[1]);
	};

	return (
		<ToolShell
			toolId="unit-converter"
			title="Unit Converter"
			description="Length · weight · temperature"
			runsLocally
		>
			<div className="flex items-center gap-1">
				{CATEGORIES.map(([c, l]) => (
					<button
						key={c}
						type="button"
						onClick={() => switchCategory(c)}
						className={`font-mono text-xs uppercase tracking-wide px-3 py-1.5 border border-rule transition-tiny ${
							category === c
								? "bg-accent-soft text-accent"
								: "hover:text-accent"
						}`}
					>
						{l}
					</button>
				))}
			</div>
			<div className="flex items-end gap-3">
				<div className="flex-1">
					<label
						htmlFor="unit-value"
						className="font-mono text-[11px] uppercase tracking-wide text-muted block mb-1.5"
					>
						value
					</label>
					<input
						id="unit-value"
						value={value}
						onChange={(e) => setValue(e.target.value)}
						type="number"
						step="any"
						className="w-full font-mono text-sm bg-surface border border-rule rounded-none px-3 py-2 focus:outline-none focus:border-accent transition-tiny"
					/>
				</div>
				<div>
					<label
						htmlFor="unit-from"
						className="font-mono text-[11px] uppercase tracking-wide text-muted block mb-1.5"
					>
						from
					</label>
					<select
						id="unit-from"
						value={from}
						onChange={(e) => setFrom(e.target.value)}
						className="font-mono text-sm bg-surface border border-rule rounded-none px-3 py-2 focus:outline-none focus:border-accent transition-tiny"
					>
						{units.map((u) => (
							<option key={u} value={u}>
								{u}
							</option>
						))}
					</select>
				</div>
				<div>
					<label
						htmlFor="unit-to"
						className="font-mono text-[11px] uppercase tracking-wide text-muted block mb-1.5"
					>
						to
					</label>
					<select
						id="unit-to"
						value={to}
						onChange={(e) => setTo(e.target.value)}
						className="font-mono text-sm bg-surface border border-rule rounded-none px-3 py-2 focus:outline-none focus:border-accent transition-tiny"
					>
						{units.map((u) => (
							<option key={u} value={u}>
								{u}
							</option>
						))}
					</select>
				</div>
			</div>
			{result != null && (
				<div className="border border-rule bg-surface px-3.5 py-3 flex items-center justify-between">
					<span className="font-mono text-sm text-muted">result</span>
					<span className="font-mono text-2xl">
						{Number.parseFloat(result.toFixed(6))} {to}
					</span>
				</div>
			)}
		</ToolShell>
	);
}
