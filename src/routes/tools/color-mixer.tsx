import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";

import CopyButton from "#/components/CopyButton";
import ToolShell from "#/components/ToolShell";
import { toolHead } from "#/lib/seo";

export const Route = createFileRoute("/tools/color-mixer")({
	head: () => toolHead("color-mixer"),
	component: ColorMixer,
});

interface Rgb {
	r: number;
	g: number;
	b: number;
}

function hexToRgb(hex: string): Rgb | null {
	const m = hex.replace("#", "").match(/.{2}/g);
	return m
		? {
				r: Number.parseInt(m[0], 16),
				g: Number.parseInt(m[1], 16),
				b: Number.parseInt(m[2], 16),
			}
		: null;
}

function rgbToHex({ r, g, b }: Rgb): string {
	return `#${[r, g, b].map((v) => Math.round(v).toString(16).padStart(2, "0")).join("")}`;
}

function mix(c1: Rgb, c2: Rgb, t: number): Rgb {
	return {
		r: c1.r + (c2.r - c1.r) * t,
		g: c1.g + (c2.g - c1.g) * t,
		b: c1.b + (c2.b - c1.b) * t,
	};
}

function ColorMixer() {
	const [c1, setC1] = useState("#ff0000");
	const [c2, setC2] = useState("#0000ff");
	const [t, setT] = useState(50);
	const result = useMemo(() => {
		const a = hexToRgb(c1);
		const b = hexToRgb(c2);
		if (!a || !b) return null;
		return rgbToHex(mix(a, b, t / 100));
	}, [c1, c2, t]);

	return (
		<ToolShell
			toolId="color-mixer"
			title="Color Mixer"
			description="Mix two colors"
			runsLocally
		>
			<div className="grid grid-cols-2 gap-3">
				<div>
					<label
						htmlFor="mixer-color-a"
						className="font-mono text-[11px] uppercase tracking-wide text-muted block mb-1.5"
					>
						color a
					</label>
					<div className="flex items-center gap-2">
						<input
							type="color"
							value={c1}
							onChange={(e) => setC1(e.target.value)}
							className="w-12 h-9 bg-surface border border-rule"
						/>
						<input
							id="mixer-color-a"
							value={c1}
							onChange={(e) => setC1(e.target.value)}
							spellCheck={false}
							className="flex-1 font-mono text-sm bg-surface border border-rule rounded-none px-3 py-2 focus:outline-none focus:border-accent transition-tiny"
						/>
					</div>
				</div>
				<div>
					<label
						htmlFor="mixer-color-b"
						className="font-mono text-[11px] uppercase tracking-wide text-muted block mb-1.5"
					>
						color b
					</label>
					<div className="flex items-center gap-2">
						<input
							type="color"
							value={c2}
							onChange={(e) => setC2(e.target.value)}
							className="w-12 h-9 bg-surface border border-rule"
						/>
						<input
							id="mixer-color-b"
							value={c2}
							onChange={(e) => setC2(e.target.value)}
							spellCheck={false}
							className="flex-1 font-mono text-sm bg-surface border border-rule rounded-none px-3 py-2 focus:outline-none focus:border-accent transition-tiny"
						/>
					</div>
				</div>
			</div>
			<div className="flex items-center gap-3">
				<label
					htmlFor="mixer-ratio"
					className="font-mono text-[11px] uppercase tracking-wide text-muted"
				>
					mix
				</label>
				<input
					id="mixer-ratio"
					type="range"
					min="0"
					max="100"
					value={t}
					onChange={(e) => setT(Number(e.target.value))}
					className="flex-1 accent-accent"
				/>
				<span className="font-mono text-sm w-12">{t}%</span>
			</div>
			{result && (
				<div>
					<div
						className="h-16 border border-rule"
						style={{ background: result }}
					/>
					<div className="flex items-center justify-between mt-2">
						<span className="font-mono text-sm">{result}</span>
						<CopyButton value={result} label="copy" />
					</div>
				</div>
			)}
		</ToolShell>
	);
}
