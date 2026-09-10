import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";

import ToolShell from "#/components/ToolShell";
import { toolHead } from "#/lib/seo";

export const Route = createFileRoute("/tools/image-format-converter")({
	head: () => toolHead("image-format-converter"),
	component: ImageFormatConverter,
});

type Format = "image/png" | "image/jpeg" | "image/webp";

function ImageFormatConverter() {
	const [src, setSrc] = useState<string | null>(null);
	const [format, setFormat] = useState<Format>("image/png");
	const [quality, setQuality] = useState(0.9);
	const [out, setOut] = useState<string | null>(null);
	const fileRef = useRef<HTMLInputElement>(null);

	const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
		const f = e.target.files?.[0];
		if (!f) return;
		const reader = new FileReader();
		reader.onload = () => {
			setSrc(reader.result as string);
			setOut(null);
		};
		reader.readAsDataURL(f);
	};

	const convert = () => {
		if (!src) return;
		const img = new Image();
		img.onload = () => {
			const canvas = document.createElement("canvas");
			canvas.width = img.naturalWidth;
			canvas.height = img.naturalHeight;
			const ctx = canvas.getContext("2d");
			if (!ctx) return;
			ctx.drawImage(img, 0, 0);
			setOut(canvas.toDataURL(format, quality));
		};
		img.src = src;
	};

	const download = () => {
		if (!out) return;
		const a = document.createElement("a");
		a.href = out;
		a.download = `converted.${format.split("/")[1].replace("jpeg", "jpg")}`;
		a.click();
	};

	return (
		<ToolShell
			toolId="image-format-converter"
			title="Image Format Converter"
			description="PNG · JPG · WebP"
			runsLocally
		>
			<div className="flex items-center gap-2 flex-wrap">
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
				<div className="flex items-center gap-1">
					{(["image/png", "image/jpeg", "image/webp"] as const).map((f) => (
						<button
							key={f}
							type="button"
							onClick={() => setFormat(f)}
							className={`font-mono text-xs px-2 py-1 border border-rule transition-tiny ${
								format === f
									? "bg-accent-soft text-accent"
									: "hover:text-accent"
							}`}
						>
							{f.split("/")[1].replace("jpeg", "jpg")}
						</button>
					))}
				</div>
			</div>
			{src && format !== "image/png" && (
				<div className="flex items-center gap-3">
					<label
						htmlFor="format-quality"
						className="font-mono text-[11px] uppercase tracking-wide text-muted"
					>
						quality
					</label>
					<input
						id="format-quality"
						type="range"
						min="10"
						max="100"
						value={Math.round(quality * 100)}
						onChange={(e) => setQuality(Number(e.target.value) / 100)}
						className="flex-1 accent-accent"
					/>
					<span className="font-mono text-xs w-10">
						{Math.round(quality * 100)}%
					</span>
				</div>
			)}
			{src && (
				<button
					type="button"
					onClick={convert}
					className="font-mono text-xs uppercase tracking-wide px-3 py-1.5 border border-rule rounded-none transition-tiny hover:text-accent hover:border-accent"
				>
					Convert
				</button>
			)}
			{out && (
				<div>
					<div className="font-mono text-[11px] uppercase tracking-wide text-muted mb-1.5">
						result
					</div>
					<img
						src={out}
						alt="converted"
						className="max-w-full border border-rule bg-surface"
					/>
					<button
						type="button"
						onClick={download}
						className="mt-2 font-mono text-xs uppercase tracking-wide px-3 py-1.5 border border-rule rounded-none transition-tiny hover:text-accent hover:border-accent"
					>
						Download
					</button>
				</div>
			)}
		</ToolShell>
	);
}
