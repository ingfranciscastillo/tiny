import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";

import ToolShell from "#/components/ToolShell";
import { toolHead } from "#/lib/seo";

export const Route = createFileRoute("/tools/favicon-generator")({
	head: () => toolHead("favicon-generator"),
	component: FaviconGenerator,
});

function FaviconGenerator() {
	const [text, setText] = useState("T");
	const [bg, setBg] = useState("#1a3a52");
	const [fg, setFg] = useState("#ffffff");
	const [size, setSize] = useState(64);
	const canvasRef = useRef<HTMLCanvasElement>(null);

	const draw = () => {
		const canvas = canvasRef.current;
		if (!canvas) return;
		const ctx = canvas.getContext("2d");
		if (!ctx) return;
		ctx.fillStyle = bg;
		ctx.fillRect(0, 0, size, size);
		ctx.fillStyle = fg;
		ctx.font = `${size * 0.6}px 'IBM Plex Sans', sans-serif`;
		ctx.textAlign = "center";
		ctx.textBaseline = "middle";
		ctx.fillText(text.slice(0, 2), size / 2, size / 2 + size * 0.04);
	};

	const download = () => {
		const canvas = canvasRef.current;
		if (!canvas) return;
		const a = document.createElement("a");
		a.href = canvas.toDataURL("image/png");
		a.download = "favicon.png";
		a.click();
	};

	return (
		<ToolShell
			toolId="favicon-generator"
			title="Favicon Generator"
			description="Generate favicon from image/text"
			runsLocally
		>
			<div className="flex items-end gap-3 flex-wrap">
				<div>
					<label
						htmlFor="favicon-text"
						className="font-mono text-[11px] uppercase tracking-wide text-muted block mb-1.5"
					>
						text
					</label>
					<input
						id="favicon-text"
						value={text}
						onChange={(e) => setText(e.target.value)}
						maxLength={2}
						spellCheck={false}
						className="w-20 font-mono text-sm bg-surface border border-rule rounded-none px-3 py-2 focus:outline-none focus:border-accent transition-tiny"
					/>
				</div>
				<div>
					<label
						htmlFor="favicon-bg"
						className="font-mono text-[11px] uppercase tracking-wide text-muted block mb-1.5"
					>
						bg
					</label>
					<input
						id="favicon-bg"
						type="color"
						value={bg}
						onChange={(e) => setBg(e.target.value)}
						className="w-12 h-9 bg-surface border border-rule"
					/>
				</div>
				<div>
					<label
						htmlFor="favicon-fg"
						className="font-mono text-[11px] uppercase tracking-wide text-muted block mb-1.5"
					>
						fg
					</label>
					<input
						id="favicon-fg"
						type="color"
						value={fg}
						onChange={(e) => setFg(e.target.value)}
						className="w-12 h-9 bg-surface border border-rule"
					/>
				</div>
				<div>
					<label
						htmlFor="favicon-size"
						className="font-mono text-[11px] uppercase tracking-wide text-muted block mb-1.5"
					>
						size
					</label>
					<input
						id="favicon-size"
						type="number"
						min="16"
						max="512"
						value={size}
						onChange={(e) => setSize(Number(e.target.value))}
						className="w-20 font-mono text-sm bg-surface border border-rule rounded-none px-3 py-2 focus:outline-none focus:border-accent transition-tiny"
					/>
				</div>
				<button
					type="button"
					onClick={draw}
					className="font-mono text-xs uppercase tracking-wide px-3 py-2 border border-rule transition-tiny hover:text-accent hover:border-accent"
				>
					Render
				</button>
			</div>
			<div className="flex items-center gap-4">
				<canvas
					ref={canvasRef}
					width={size}
					height={size}
					className="border border-rule bg-surface"
				/>
				<button
					type="button"
					onClick={download}
					className="font-mono text-xs uppercase tracking-wide px-3 py-1.5 border border-rule transition-tiny hover:text-accent hover:border-accent"
				>
					Download PNG
				</button>
			</div>
		</ToolShell>
	);
}
