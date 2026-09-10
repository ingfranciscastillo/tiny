import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";

import CopyButton from "#/components/CopyButton";
import ToolShell from "#/components/ToolShell";
import { toolHead } from "#/lib/seo";

export const Route = createFileRoute("/tools/color-extractor")({
	head: () => toolHead("color-extractor"),
	component: ColorExtractor,
});

function rgbToHex(r: number, g: number, b: number): string {
	return `#${[r, g, b].map((v) => Math.round(v).toString(16).padStart(2, "0")).join("")}`;
}

function ColorExtractor() {
	const [colors, setColors] = useState<string[]>([]);
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const fileRef = useRef<HTMLInputElement>(null);

	const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
		const f = e.target.files?.[0];
		if (!f) return;
		const img = new Image();
		img.onload = () => {
			const canvas = canvasRef.current;
			if (!canvas) return;
			canvas.width = 100;
			canvas.height = 100;
			const ctx = canvas.getContext("2d");
			if (!ctx) return;
			ctx.drawImage(img, 0, 0, 100, 100);
			const data = ctx.getImageData(0, 0, 100, 100).data;
			const map: Record<string, number> = {};
			for (let i = 0; i < data.length; i += 4) {
				const r = data[i] & 0xf0;
				const g = data[i + 1] & 0xf0;
				const b = data[i + 2] & 0xf0;
				const key = `${r},${g},${b}`;
				map[key] = (map[key] || 0) + 1;
			}
			const sorted = Object.entries(map)
				.sort((a, b) => b[1] - a[1])
				.slice(0, 8)
				.map(([k]) => {
					const [r, g, b] = k.split(",").map(Number);
					return rgbToHex(r + 8, g + 8, b + 8);
				});
			setColors(sorted);
			URL.revokeObjectURL(img.src);
		};
		img.src = URL.createObjectURL(f);
	};

	return (
		<ToolShell
			toolId="color-extractor"
			title="Color Extractor"
			description="Extract colors from an image"
			runsLocally
		>
			<div className="flex items-center gap-2">
				<button
					type="button"
					onClick={() => fileRef.current?.click()}
					className="font-mono text-xs uppercase tracking-wide px-3 py-1.5 border border-rule rounded-none transition-tiny hover:text-accent hover:border-accent"
				>
					Choose image
				</button>
				<input
					ref={fileRef}
					type="file"
					accept="image/*"
					onChange={onFile}
					className="hidden"
				/>
			</div>
			<canvas ref={canvasRef} className="hidden" />
			<div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
				{colors.map((c) => (
					<div key={c}>
						<div
							className="h-14 border border-rule"
							style={{ background: c }}
						/>
						<div className="flex items-center justify-between mt-1">
							<span className="font-mono text-xs">{c}</span>
							<CopyButton value={c} label="copy" />
						</div>
					</div>
				))}
			</div>
			{colors.length === 0 && (
				<div className="font-mono text-sm text-muted">
					choose an image to extract colors
				</div>
			)}
		</ToolShell>
	);
}
