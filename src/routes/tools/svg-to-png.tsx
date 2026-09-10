import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import ToolShell, { WorkSurface } from "#/components/ToolShell";
import { toolHead } from "#/lib/seo";

export const Route = createFileRoute("/tools/svg-to-png")({
	head: () => toolHead("svg-to-png"),
	component: SvgToPng,
});

function SvgToPng() {
	const [input, setInput] = useState("");
	const [size, setSize] = useState(512);
	const [out, setOut] = useState<string | null>(null);

	const convert = () => {
		const blob = new Blob([input], { type: "image/svg+xml" });
		const url = URL.createObjectURL(blob);
		const img = new Image();
		img.onload = () => {
			const canvas = document.createElement("canvas");
			canvas.width = size;
			canvas.height = size;
			const ctx = canvas.getContext("2d");
			if (!ctx) return;
			ctx.drawImage(img, 0, 0, size, size);
			setOut(canvas.toDataURL("image/png"));
			URL.revokeObjectURL(url);
		};
		img.src = url;
	};

	const download = () => {
		if (!out) return;
		const a = document.createElement("a");
		a.href = out;
		a.download = "converted.png";
		a.click();
	};

	return (
		<ToolShell
			toolId="svg-to-png"
			title="SVG → PNG"
			description="Rasterize SVG"
			runsLocally
		>
			<WorkSurface
				label="svg"
				value={input}
				onChange={(e) => setInput(e.target.value)}
				placeholder="<svg>...</svg>"
				rows={6}
			/>
			<div className="flex items-center gap-3">
				<label
					htmlFor="svg-to-png-size"
					className="font-mono text-[11px] uppercase tracking-wide text-muted"
				>
					size
				</label>
				<input
					id="svg-to-png-size"
					type="number"
					min="16"
					max="2048"
					value={size}
					onChange={(e) => setSize(Number(e.target.value))}
					className="w-24 font-mono text-sm bg-surface border border-rule rounded-none px-3 py-2 focus:outline-none focus:border-accent transition-tiny"
				/>
				<button
					type="button"
					onClick={convert}
					disabled={!input.trim()}
					className="font-mono text-xs uppercase tracking-wide px-3 py-1.5 border border-rule rounded-none transition-tiny disabled:opacity-30 hover:text-accent hover:border-accent"
				>
					Convert
				</button>
			</div>
			{out && (
				<div>
					<div className="font-mono text-[11px] uppercase tracking-wide text-muted mb-1.5">
						result
					</div>
					<img
						src={out}
						alt="png"
						className="max-w-full border border-rule bg-surface"
					/>
					<button
						type="button"
						onClick={download}
						className="mt-2 font-mono text-xs uppercase tracking-wide px-3 py-1.5 border border-rule rounded-none transition-tiny hover:text-accent hover:border-accent"
					>
						Download PNG
					</button>
				</div>
			)}
		</ToolShell>
	);
}
