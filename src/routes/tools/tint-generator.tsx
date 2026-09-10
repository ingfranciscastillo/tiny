import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";

import CopyButton from "#/components/CopyButton";
import ToolShell from "#/components/ToolShell";
import { toolHead } from "#/lib/seo";

export const Route = createFileRoute("/tools/tint-generator")({
	head: () => toolHead("tint-generator"),
	component: TintGenerator,
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
	return `#${[r, g, b]
		.map((v) =>
			Math.round(Math.max(0, Math.min(255, v)))
				.toString(16)
				.padStart(2, "0"),
		)
		.join("")}`;
}

function TintGenerator() {
	const [color, setColor] = useState("#1a3a52");
	const tints = useMemo(() => {
		const rgb = hexToRgb(color);
		if (!rgb) return [];
		return [10, 20, 30, 40, 50, 60, 70, 80, 90].map((pct) => {
			const f = pct / 100;
			return {
				pct,
				hex: rgbToHex({
					r: rgb.r + (255 - rgb.r) * f,
					g: rgb.g + (255 - rgb.g) * f,
					b: rgb.b + (255 - rgb.b) * f,
				}),
			};
		});
	}, [color]);

	return (
		<ToolShell
			toolId="tint-generator"
			title="Tint Generator"
			description="Generate tints"
			runsLocally
		>
			<div className="flex items-center gap-2">
				<input
					type="color"
					value={color}
					onChange={(e) => setColor(e.target.value)}
					className="w-12 h-9 bg-surface border border-rule"
				/>
				<input
					value={color}
					onChange={(e) => setColor(e.target.value)}
					spellCheck={false}
					className="flex-1 font-mono text-sm bg-surface border border-rule rounded-none px-3 py-2 focus:outline-none focus:border-accent transition-tiny"
				/>
			</div>
			<div className="grid grid-cols-3 sm:grid-cols-9 gap-1">
				{tints.map((t) => (
					<div key={t.pct}>
						<div
							className="h-12 border border-rule"
							style={{ background: t.hex }}
						/>
						<div className="font-mono text-[10px] text-muted mt-1 text-center">
							{t.pct}%
						</div>
						<CopyButton
							value={t.hex}
							label={t.hex}
							className="w-full text-center text-[10px] px-1 py-1"
						/>
					</div>
				))}
			</div>
		</ToolShell>
	);
}
