import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";

import ToolShell from "#/components/ToolShell";

export const Route = createFileRoute("/tools/image-cropper")({
	component: ImageCropper,
});

const RATIOS: Record<string, number | null> = {
	free: null,
	"1:1": 1,
	"4:3": 4 / 3,
	"16:9": 16 / 9,
	"3:2": 3 / 2,
};

type Ratio = keyof typeof RATIOS;

interface CropRect {
	x: number;
	y: number;
	w: number;
	h: number;
}

interface DragState {
	startX: number;
	startY: number;
}

type PointerEvt =
	| React.MouseEvent<HTMLDivElement>
	| React.TouchEvent<HTMLDivElement>;

function getClientPoint(e: PointerEvt) {
	if ("touches" in e) {
		return { clientX: e.touches[0].clientX, clientY: e.touches[0].clientY };
	}
	return { clientX: e.clientX, clientY: e.clientY };
}

function ImageCropper() {
	const [src, setSrc] = useState<string | null>(null);
	const [ratio, setRatio] = useState<Ratio>("free");
	const [out, setOut] = useState<string | null>(null);
	const [crop, setCrop] = useState<CropRect>({ x: 0, y: 0, w: 0, h: 0 });
	const imgRef = useRef<HTMLImageElement>(null);
	const fileRef = useRef<HTMLInputElement>(null);
	const drag = useRef<DragState | null>(null);

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

	const updateCrop = (x: number, y: number, w: number, h: number) => {
		setCrop({
			x: w < 0 ? x + w : x,
			y: h < 0 ? y + h : y,
			w: Math.abs(w),
			h: Math.abs(h),
		});
	};

	const startDrag = (e: PointerEvt) => {
		const rect = e.currentTarget.getBoundingClientRect();
		const { clientX, clientY } = getClientPoint(e);
		const x = clientX - rect.left;
		const y = clientY - rect.top;
		drag.current = { startX: x, startY: y };
		updateCrop(x, y, 0, 0);
	};
	const moveDrag = (e: PointerEvt) => {
		if (!drag.current) return;
		const rect = e.currentTarget.getBoundingClientRect();
		const { clientX, clientY } = getClientPoint(e);
		const x = clientX - rect.left;
		const y = clientY - rect.top;
		let w = x - drag.current.startX;
		let h = y - drag.current.startY;
		const r = RATIOS[ratio];
		if (r) {
			if (Math.abs(w) > Math.abs(h) * r)
				h = ((Math.sign(h) || 1) * Math.abs(w)) / r;
			else w = (Math.sign(w) || 1) * Math.abs(h) * r;
		}
		updateCrop(drag.current.startX, drag.current.startY, w, h);
	};
	const endDrag = () => {
		drag.current = null;
	};

	const doCrop = () => {
		const img = imgRef.current;
		if (!img || !crop.w || !crop.h) return;
		const dispW = img.clientWidth;
		const dispH = img.clientHeight;
		const sx = (crop.x / dispW) * img.naturalWidth;
		const sy = (crop.y / dispH) * img.naturalHeight;
		const sw = (crop.w / dispW) * img.naturalWidth;
		const sh = (crop.h / dispH) * img.naturalHeight;
		const canvas = document.createElement("canvas");
		canvas.width = sw;
		canvas.height = sh;
		const ctx = canvas.getContext("2d");
		if (!ctx) return;
		ctx.drawImage(img, sx, sy, sw, sh, 0, 0, sw, sh);
		setOut(canvas.toDataURL("image/png"));
	};

	const download = () => {
		if (!out) return;
		const a = document.createElement("a");
		a.href = out;
		a.download = "cropped.png";
		a.click();
	};

	return (
		<ToolShell
			toolId="image-cropper"
			title="Image Cropper"
			description="Crop an image in your browser"
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
				<div className="flex items-center gap-1 ml-2">
					<span className="font-mono text-[11px] uppercase tracking-wide text-muted">
						ratio
					</span>
					{(Object.keys(RATIOS) as Ratio[]).map((r) => (
						<button
							key={r}
							type="button"
							onClick={() => setRatio(r)}
							className={`font-mono text-xs px-2 py-1 border border-rule transition-tiny ${
								ratio === r ? "bg-accent-soft text-accent" : "hover:text-accent"
							}`}
						>
							{r}
						</button>
					))}
				</div>
			</div>

			{src && (
				// biome-ignore lint/a11y/noStaticElementInteractions: drag-to-select crop surface, no semantic role fits a free-form rectangle selector
				<div
					className="relative bg-surface border border-rule overflow-hidden select-none touch-none"
					onMouseDown={startDrag}
					onMouseMove={moveDrag}
					onMouseUp={endDrag}
					onMouseLeave={endDrag}
					onTouchStart={startDrag}
					onTouchMove={moveDrag}
					onTouchEnd={endDrag}
				>
					<img
						ref={imgRef}
						src={src}
						alt="to crop"
						className="block max-w-full select-none pointer-events-none"
						draggable={false}
					/>
					{crop.w > 0 && crop.h > 0 && (
						<div
							className="absolute border border-accent pointer-events-none"
							style={{
								left: crop.x,
								top: crop.y,
								width: crop.w,
								height: crop.h,
							}}
						/>
					)}
					<div className="absolute bottom-2 left-2 font-mono text-[10px] text-muted bg-surface/80 px-1.5 py-0.5">
						drag to select
					</div>
				</div>
			)}

			{src && (
				<button
					type="button"
					onClick={doCrop}
					disabled={!crop.w || !crop.h}
					className="font-mono text-xs uppercase tracking-wide px-3 py-1.5 border border-rule rounded-none transition-tiny disabled:opacity-30 hover:text-accent hover:border-accent"
				>
					Crop
				</button>
			)}

			{out && (
				<div>
					<div className="font-mono text-[11px] uppercase tracking-wide text-muted mb-1.5">
						result
					</div>
					<img
						src={out}
						alt="cropped"
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
