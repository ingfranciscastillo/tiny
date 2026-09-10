import { createFileRoute } from "@tanstack/react-router";
import { QRCodeCanvas } from "qrcode.react";
import { useEffect, useRef, useState } from "react";

import ToolShell from "#/components/ToolShell";

export const Route = createFileRoute("/tools/qr-generator")({
	component: QrGenerator,
});

type ErrorCorrection = "L" | "M" | "Q" | "H";

function QrGenerator() {
	const [text, setText] = useState("https://tiny.tools");
	const [ec, setEc] = useState<ErrorCorrection>("L");
	const size = 320;
	const [colors, setColors] = useState({ fg: "#000", bg: "#fff" });
	const canvasRef = useRef<HTMLCanvasElement>(null);

	useEffect(() => {
		const styles = window.getComputedStyle(document.documentElement);
		const fg = styles.getPropertyValue("--text").trim();
		const bg = styles.getPropertyValue("--surface").trim();
		setColors({
			fg: fg ? `hsl(${fg})` : "#000",
			bg: bg ? `hsl(${bg})` : "#fff",
		});
	}, []);

	const download = () => {
		const canvas = canvasRef.current;
		if (!canvas) return;
		const a = document.createElement("a");
		a.href = canvas.toDataURL("image/png");
		a.download = "qr.png";
		a.click();
	};

	return (
		<ToolShell
			toolId="qr"
			title="QR Generator"
			description="Create a QR code from text or a URL"
			runsLocally
		>
			<div>
				<label
					htmlFor="qr-content"
					className="font-mono text-[11px] uppercase tracking-wide text-muted block mb-1.5"
				>
					content
				</label>
				<input
					id="qr-content"
					value={text}
					onChange={(e) => setText(e.target.value)}
					spellCheck={false}
					placeholder="text or URL"
					className="w-full font-mono text-sm bg-surface border border-rule rounded-none px-3.5 py-3 focus:outline-none focus:border-accent transition-tiny placeholder:text-muted/50"
				/>
			</div>

			<div className="flex items-center gap-2">
				<span className="font-mono text-[11px] uppercase tracking-wide text-muted">
					error correction
				</span>
				{(["L", "M", "Q", "H"] as const).map((lvl) => (
					<button
						key={lvl}
						type="button"
						onClick={() => setEc(lvl)}
						className={`font-mono text-xs px-2 py-1 border border-rule transition-tiny ${
							ec === lvl ? "bg-accent-soft text-accent" : "hover:text-accent"
						}`}
					>
						{lvl}
					</button>
				))}
			</div>

			<div className="flex flex-col items-center gap-4 py-4">
				<div
					className="border border-rule bg-surface flex items-center justify-center"
					style={{ width: size, height: size }}
				>
					{text.trim() && (
						<QRCodeCanvas
							ref={canvasRef}
							value={text}
							size={size}
							level={ec}
							marginSize={2}
							fgColor={colors.fg}
							bgColor={colors.bg}
						/>
					)}
				</div>
				{text.trim() && (
					<button
						type="button"
						onClick={download}
						className="font-mono text-xs uppercase tracking-wide px-3 py-1.5 border border-rule rounded-none transition-tiny hover:text-accent hover:border-accent"
					>
						Download PNG
					</button>
				)}
			</div>
		</ToolShell>
	);
}
