import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";
import ToolShell from "#/components/ToolShell";
import { toolHead } from "#/lib/seo";

export const Route = createFileRoute("/tools/image-compress")({
	head: () => toolHead("image-compress"),
	component: ImageCompress,
});

type Format = "image/jpeg" | "image/webp";

interface FileInfo {
	name: string;
	size: number;
	type: string;
}

function ImageCompress() {
	const [src, setSrc] = useState<string | null>(null);
	const [quality, setQuality] = useState(0.7);
	const [format, setFormat] = useState<Format>("image/jpeg");
	const [out, setOut] = useState<string | null>(null);
	const [info, setInfo] = useState<FileInfo | null>(null);
	const fileRef = useRef<HTMLInputElement>(null);

	const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
		const f = e.target.files?.[0];
		if (!f) return;
		setInfo({ name: f.name, size: f.size, type: f.type });
		const reader = new FileReader();
		reader.onload = () => {
			setSrc(reader.result as string);
			setOut(null);
		};
		reader.readAsDataURL(f);
	};

	const compress = () => {
		if (!src) return;
		const img = new Image();
		img.onload = () => {
			const canvas = document.createElement("canvas");
			canvas.width = img.naturalWidth;
			canvas.height = img.naturalHeight;
			const ctx = canvas.getContext("2d");
			if (!ctx) return;
			ctx.drawImage(img, 0, 0);
			const dataUrl = canvas.toDataURL(format, quality);
			setOut(dataUrl);
		};
		img.src = src;
	};

	const download = () => {
		if (!out) return;
		const a = document.createElement("a");
		a.href = out;
		a.download = `compressed.${format === "image/jpeg" ? "jpg" : "png"}`;
		a.click();
	};

	const outSize = out ? Math.round((out.length * 3) / 4) : 0;
	const saved =
		info && out ? Math.max(0, Math.round((1 - outSize / info.size) * 100)) : 0;

	return (
		<ToolShell
			toolId="image-compress"
			title="Image Compress"
			description="Reduce image file size in your browser"
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
					{(["image/jpeg", "image/webp"] as const).map((f) => (
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
							{f.split("/")[1]}
						</button>
					))}
				</div>
			</div>

			{src && (
				<div className="flex items-center gap-3">
					<label
						htmlFor="compress-quality"
						className="font-mono text-[11px] uppercase tracking-wide text-muted"
					>
						quality
					</label>
					<input
						id="compress-quality"
						type="range"
						min="10"
						max="100"
						value={Math.round(quality * 100)}
						onChange={(e) => setQuality(Number(e.target.value) / 100)}
						className="flex-1 accent-accent"
					/>
					<span className="font-mono text-xs w-10 text-right">
						{Math.round(quality * 100)}%
					</span>
				</div>
			)}

			{src && (
				<button
					type="button"
					onClick={compress}
					className="font-mono text-xs uppercase tracking-wide px-3 py-1.5 border border-rule rounded-none transition-tiny hover:text-accent hover:border-accent"
				>
					Compress
				</button>
			)}

			{out && (
				<div>
					<div className="font-mono text-[11px] uppercase tracking-wide text-muted mb-1.5 flex justify-between">
						<span>result · {saved}% smaller</span>
						<span>{(outSize / 1024).toFixed(1)} KB</span>
					</div>
					<img
						src={out}
						alt="compressed"
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
