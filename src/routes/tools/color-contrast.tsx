import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";

import ToolShell from "#/components/ToolShell";
import { toolHead } from "#/lib/seo";

export const Route = createFileRoute("/tools/color-contrast")({
	head: () => toolHead("color-contrast"),
	component: ColorContrast,
});

interface Rgb {
	r: number;
	g: number;
	b: number;
}

function hexToRgb(hex: string): Rgb | null {
	const m = hex.replace("#", "").match(/.{2}/g);
	if (!m || m.length < 3) return null;
	return {
		r: Number.parseInt(m[0], 16),
		g: Number.parseInt(m[1], 16),
		b: Number.parseInt(m[2], 16),
	};
}

function luminance({ r, g, b }: Rgb): number {
	const [R, G, B] = [r, g, b].map((v) => {
		v /= 255;
		return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
	});
	return 0.2126 * R + 0.7152 * G + 0.0722 * B;
}

function contrast(c1: Rgb, c2: Rgb): number {
	const l1 = luminance(c1);
	const l2 = luminance(c2);
	return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
}

function ColorContrast() {
	const [fg, setFg] = useState("#1a3a52");
	const [bg, setBg] = useState("#ffffff");
	const ratio = useMemo(() => {
		const f = hexToRgb(fg);
		const b = hexToRgb(bg);
		if (!f || !b) return null;
		return contrast(f, b);
	}, [fg, bg]);

	const wcag = ratio
		? {
				aa: ratio >= 4.5,
				aaLarge: ratio >= 3,
				aaa: ratio >= 7,
				aaaLarge: ratio >= 4.5,
			}
		: null;

	return (
		<ToolShell
			toolId="color-contrast"
			title="Color Contrast"
			description="WCAG contrast checker"
			runsLocally
		>
			<div className="grid grid-cols-2 gap-3">
				<div>
					<label
						htmlFor="contrast-fg"
						className="font-mono text-[11px] uppercase tracking-wide text-muted block mb-1.5"
					>
						foreground
					</label>
					<div className="flex items-center gap-2">
						<input
							type="color"
							value={fg}
							onChange={(e) => setFg(e.target.value)}
							className="w-12 h-9 bg-surface border border-rule"
						/>
						<input
							id="contrast-fg"
							value={fg}
							onChange={(e) => setFg(e.target.value)}
							spellCheck={false}
							className="flex-1 font-mono text-sm bg-surface border border-rule rounded-none px-3 py-2 focus:outline-none focus:border-accent transition-tiny"
						/>
					</div>
				</div>
				<div>
					<label
						htmlFor="contrast-bg"
						className="font-mono text-[11px] uppercase tracking-wide text-muted block mb-1.5"
					>
						background
					</label>
					<div className="flex items-center gap-2">
						<input
							type="color"
							value={bg}
							onChange={(e) => setBg(e.target.value)}
							className="w-12 h-9 bg-surface border border-rule"
						/>
						<input
							id="contrast-bg"
							value={bg}
							onChange={(e) => setBg(e.target.value)}
							spellCheck={false}
							className="flex-1 font-mono text-sm bg-surface border border-rule rounded-none px-3 py-2 focus:outline-none focus:border-accent transition-tiny"
						/>
					</div>
				</div>
			</div>
			{ratio && wcag && (
				<>
					<div
						className="border border-rule p-6 text-center"
						style={{ background: bg, color: fg }}
					>
						<div className="font-heading text-xl">Sample Text Preview</div>
						<div className="font-mono text-sm mt-1">The quick brown fox</div>
					</div>
					<div className="border border-rule bg-surface divide-y divide-border">
						<div className="flex items-center justify-between px-3.5 py-3">
							<span className="font-mono text-sm text-muted">
								contrast ratio
							</span>
							<span className="font-mono text-2xl">{ratio.toFixed(2)}:1</span>
						</div>
						{(
							[
								["AA (normal)", wcag.aa],
								["AA (large)", wcag.aaLarge],
								["AAA (normal)", wcag.aaa],
								["AAA (large)", wcag.aaaLarge],
							] as const
						).map(([k, v]) => (
							<div
								key={k}
								className="flex items-center justify-between px-3.5 py-2.5"
							>
								<span className="font-mono text-xs text-muted">{k}</span>
								<span
									className={`font-mono text-sm ${v ? "text-accent" : "text-muted"}`}
								>
									{v ? "✓ pass" : "✗ fail"}
								</span>
							</div>
						))}
					</div>
				</>
			)}
		</ToolShell>
	);
}
