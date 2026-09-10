import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";

import ToolShell from "#/components/ToolShell";
import { toolHead } from "#/lib/seo";

export const Route = createFileRoute("/tools/placeholder-image")({
	head: () => toolHead("placeholder-image"),
	component: PlaceholderImage,
});

function PlaceholderImage() {
	const [width, setWidth] = useState(400);
	const [height, setHeight] = useState(300);
	const [text, setText] = useState("400 × 300");
	const [bg, setBg] = useState("#e5e7eb");
	const [fg, setFg] = useState("#6b7280");
	const [out, setOut] = useState<string | null>(null);
	const canvasRef = useRef<HTMLCanvasElement>(null);

	const generate = () => {
		const canvas = canvasRef.current;
		if (!canvas) return;
		canvas.width = width;
		canvas.height = height;
		const ctx = canvas.getContext("2d");
		if (!ctx) return;
		ctx.fillStyle = bg;
		ctx.fillRect(0, 0, width, height);
		ctx.fillStyle = fg;
		ctx.font = `${Math.min(width, height) / 8}px 'IBM Plex Sans', sans-serif`;
		ctx.textAlign = "center";
		ctx.textBaseline = "middle";
		ctx.fillText(text || `${width} × ${height}`, width / 2, height / 2);
		setOut(canvas.toDataURL("image/png"));
	};

	const download = () => {
		if (!out) return;
		const a = document.createElement("a");
		a.href = out;
		a.download = "placeholder.png";
		a.click();
	};

	return (
		<ToolShell
			toolId="placeholder-image"
			title="Placeholder Image"
			description="Generate placeholder images"
			runsLocally
		>
			<div className="space-y-3">
				<div className="grid grid-cols-2 gap-3">
					<div>
						<label
							htmlFor="placeholder-width"
							className="font-mono text-[11px] uppercase tracking-wide text-muted block mb-1.5"
						>
							width
						</label>
						<input
							id="placeholder-width"
							type="number"
							value={width}
							onChange={(e) => setWidth(Number(e.target.value))}
							className="w-full font-mono text-sm bg-surface border border-rule rounded-none px-3 py-2 focus:outline-none focus:border-accent transition-tiny"
						/>
					</div>
					<div>
						<label
							htmlFor="placeholder-height"
							className="font-mono text-[11px] uppercase tracking-wide text-muted block mb-1.5"
						>
							height
						</label>
						<input
							id="placeholder-height"
							type="number"
							value={height}
							onChange={(e) => setHeight(Number(e.target.value))}
							className="w-full font-mono text-sm bg-surface border border-rule rounded-none px-3 py-2 focus:outline-none focus:border-accent transition-tiny"
						/>
					</div>
				</div>
				<div>
					<label
						htmlFor="placeholder-text"
						className="font-mono text-[11px] uppercase tracking-wide text-muted block mb-1.5"
					>
						text
					</label>
					<input
						id="placeholder-text"
						value={text}
						onChange={(e) => setText(e.target.value)}
						spellCheck={false}
						className="w-full font-mono text-sm bg-surface border border-rule rounded-none px-3 py-2 focus:outline-none focus:border-accent transition-tiny"
					/>
				</div>
				<div className="flex items-center gap-3">
					<div className="flex items-center gap-2">
						<label
							htmlFor="placeholder-bg"
							className="font-mono text-[11px] uppercase tracking-wide text-muted"
						>
							bg
						</label>
						<input
							id="placeholder-bg"
							type="color"
							value={bg}
							onChange={(e) => setBg(e.target.value)}
							className="w-10 h-9 bg-surface border border-rule"
						/>
					</div>
					<div className="flex items-center gap-2">
						<label
							htmlFor="placeholder-fg"
							className="font-mono text-[11px] uppercase tracking-wide text-muted"
						>
							fg
						</label>
						<input
							id="placeholder-fg"
							type="color"
							value={fg}
							onChange={(e) => setFg(e.target.value)}
							className="w-10 h-9 bg-surface border border-rule"
						/>
					</div>
				</div>
				<button
					type="button"
					onClick={generate}
					className="font-mono text-xs uppercase tracking-wide px-3 py-1.5 border border-rule rounded-none transition-tiny hover:text-accent hover:border-accent"
				>
					Generate
				</button>
			</div>
			<canvas ref={canvasRef} className="hidden" />
			{out && (
				<div>
					<div className="font-mono text-[11px] uppercase tracking-wide text-muted mb-1.5">
						result
					</div>
					<img
						src={out}
						alt="placeholder"
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
