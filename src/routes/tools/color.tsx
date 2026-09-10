import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import CopyButton from "#/components/CopyButton";
import ToolShell from "#/components/ToolShell";

export const Route = createFileRoute("/tools/color")({
	component: ColorConverter,
});

interface Rgb {
	r: number;
	g: number;
	b: number;
}

interface Hsl {
	h: number;
	s: number;
	l: number;
}

function hexToRgb(hex: string): Rgb | null {
	let h = hex.replace("#", "").trim();
	if (h.length === 3)
		h = h
			.split("")
			.map((c) => c + c)
			.join("");
	if (!/^[0-9a-fA-F]{6}$/.test(h)) return null;
	return {
		r: Number.parseInt(h.slice(0, 2), 16),
		g: Number.parseInt(h.slice(2, 4), 16),
		b: Number.parseInt(h.slice(4, 6), 16),
	};
}

function rgbToHex({ r, g, b }: Rgb): string {
	const to = (n: number) =>
		Math.max(0, Math.min(255, Math.round(n)))
			.toString(16)
			.padStart(2, "0");
	return `#${to(r)}${to(g)}${to(b)}`;
}

function rgbToHsl({ r, g, b }: Rgb): Hsl {
	const rn = r / 255;
	const gn = g / 255;
	const bn = b / 255;
	const max = Math.max(rn, gn, bn);
	const min = Math.min(rn, gn, bn);
	let h = 0;
	let s = 0;
	const l = (max + min) / 2;
	if (max !== min) {
		const d = max - min;
		s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
		if (max === rn) h = (gn - bn) / d + (gn < bn ? 6 : 0);
		else if (max === gn) h = (bn - rn) / d + 2;
		else h = (rn - gn) / d + 4;
		h /= 6;
	}
	return {
		h: Math.round(h * 360),
		s: Math.round(s * 100),
		l: Math.round(l * 100),
	};
}

function ColorConverter() {
	const [hex, setHex] = useState("#315A72");
	const [rgb, setRgb] = useState<Rgb>({ r: 49, g: 90, b: 114 });
	const [hsl, setHsl] = useState<Hsl>({ h: 203, s: 39, l: 32 });

	const updateFromHex = (val: string) => {
		setHex(val);
		const r = hexToRgb(val);
		if (r) {
			setRgb(r);
			setHsl(rgbToHsl(r));
		}
	};
	const updateFromRgb = (key: keyof Rgb, val: string) => {
		const next = { ...rgb, [key]: Number(val) };
		setRgb(next);
		setHex(rgbToHex(next));
		setHsl(rgbToHsl(next));
	};

	const rgbStr = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
	const hslStr = `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;

	return (
		<ToolShell
			toolId="color"
			title="Color Converter"
			description="Convert between HEX, RGB, and HSL"
			runsLocally
		>
			<div className="flex items-stretch gap-4">
				<div
					className="w-20 h-20 border border-rule"
					style={{ backgroundColor: hex }}
				/>
				<div className="flex-1 space-y-2">
					<Field label="hex" value={hex} onChange={updateFromHex} copy />
					<Field label="rgb" value={rgbStr} onChange={() => {}} copy />
					<Field label="hsl" value={hslStr} onChange={() => {}} copy />
				</div>
			</div>

			<div className="grid grid-cols-3 gap-3">
				{(["r", "g", "b"] as const).map((k) => (
					<div key={k}>
						<label
							htmlFor={`rgb-${k}`}
							className="font-mono text-[11px] uppercase tracking-wide text-muted block mb-1"
						>
							{k}
						</label>
						<input
							id={`rgb-${k}`}
							type="number"
							min="0"
							max="255"
							value={rgb[k]}
							onChange={(e) => updateFromRgb(k, e.target.value)}
							className="w-full font-mono text-sm bg-surface border border-rule rounded-none px-3 py-2 focus:outline-none focus:border-accent transition-tiny"
						/>
					</div>
				))}
			</div>
		</ToolShell>
	);
}

interface FieldProps {
	label: string;
	value: string;
	onChange: (value: string) => void;
	copy?: boolean;
}

function Field({ label, value, onChange, copy }: FieldProps) {
	return (
		<div className="flex items-center gap-2">
			<span className="font-mono text-[11px] uppercase tracking-wide text-muted w-8">
				{label}
			</span>
			<input
				value={value}
				onChange={(e) => onChange(e.target.value)}
				spellCheck={false}
				className="flex-1 font-mono text-sm bg-surface border border-rule rounded-none px-3 py-2 focus:outline-none focus:border-accent transition-tiny"
			/>
			{copy && <CopyButton value={value} label="copy" />}
		</div>
	);
}
