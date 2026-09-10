import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";

import ToolShell from "#/components/ToolShell";
import { toolHead } from "#/lib/seo";

export const Route = createFileRoute("/tools/image-resize")({
	head: () => toolHead("image-resize"),
	component: ImageResize,
});

interface OrigSize {
	w: number;
	h: number;
}

function ImageResize() {
	const [src, setSrc] = useState<string | null>(null);
	const [width, setWidth] = useState(800);
	const [height, setHeight] = useState(600);
	const [keepRatio, setKeepRatio] = useState(true);
	const [out, setOut] = useState<string | null>(null);
	const [origSize, setOrigSize] = useState<OrigSize | null>(null);
	const imgRef = useRef<HTMLImageElement>(null);
	const fileRef = useRef<HTMLInputElement>(null);

	const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
		const f = e.target.files?.[0];
		if (!f) return;
		setOrigSize({ w: 0, h: 0 });
		const reader = new FileReader();
		reader.onload = () => {
			setSrc(reader.result as string);
			const img = new Image();
			img.onload = () => {
				setWidth(img.naturalWidth);
				setHeight(img.naturalHeight);
				setOrigSize({ w: img.naturalWidth, h: img.naturalHeight });
			};
			img.src = reader.result as string;
		};
		reader.readAsDataURL(f);
	};

	const resize = () => {
		const img = imgRef.current;
		if (!img) return;
		const canvas = document.createElement("canvas");
		canvas.width = width;
		canvas.height = height;
		const ctx = canvas.getContext("2d");
		if (!ctx) return;
		ctx.drawImage(img, 0, 0, width, height);
		setOut(canvas.toDataURL("image/png"));
	};

	const onWidth = (v: number) => {
		setWidth(v);
		if (keepRatio && origSize?.w)
			setHeight(Math.round((v / origSize.w) * origSize.h));
	};
	const onHeight = (v: number) => {
		setHeight(v);
		if (keepRatio && origSize?.h)
			setWidth(Math.round((v / origSize.h) * origSize.w));
	};

	const download = () => {
		if (!out) return;
		const a = document.createElement("a");
		a.href = out;
		a.download = "resized.png";
		a.click();
	};

	return (
		<ToolShell
			toolId="image-resize"
			title="Image Resize"
			description="Resize an image"
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
				{origSize && (
					<span className="font-mono text-xs text-muted">
						original: {origSize.w}×{origSize.h}
					</span>
				)}
			</div>
			{src && (
				<>
					<div className="flex items-end gap-3">
						<div>
							<label
								htmlFor="resize-width"
								className="font-mono text-[11px] uppercase tracking-wide text-muted block mb-1.5"
							>
								width
							</label>
							<input
								id="resize-width"
								type="number"
								value={width}
								onChange={(e) => onWidth(Number(e.target.value))}
								className="w-24 font-mono text-sm bg-surface border border-rule rounded-none px-3 py-2 focus:outline-none focus:border-accent transition-tiny"
							/>
						</div>
						<div>
							<label
								htmlFor="resize-height"
								className="font-mono text-[11px] uppercase tracking-wide text-muted block mb-1.5"
							>
								height
							</label>
							<input
								id="resize-height"
								type="number"
								value={height}
								onChange={(e) => onHeight(Number(e.target.value))}
								className="w-24 font-mono text-sm bg-surface border border-rule rounded-none px-3 py-2 focus:outline-none focus:border-accent transition-tiny"
							/>
						</div>
						<label className="flex items-center gap-1.5 font-mono text-xs text-muted cursor-pointer pb-2">
							<input
								type="checkbox"
								checked={keepRatio}
								onChange={(e) => setKeepRatio(e.target.checked)}
								className="accent-accent"
							/>{" "}
							keep ratio
						</label>
					</div>
					<button
						type="button"
						onClick={resize}
						className="font-mono text-xs uppercase tracking-wide px-3 py-1.5 border border-rule rounded-none transition-tiny hover:text-accent hover:border-accent"
					>
						Resize
					</button>
				</>
			)}
			{out && (
				<div>
					<div className="font-mono text-[11px] uppercase tracking-wide text-muted mb-1.5">
						result · {width}×{height}
					</div>
					<img
						src={out}
						alt="resized"
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
			{src && <img ref={imgRef} src={src} alt="source" className="hidden" />}
		</ToolShell>
	);
}
