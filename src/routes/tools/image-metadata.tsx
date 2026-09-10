import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";

import ToolShell from "#/components/ToolShell";
import { toolHead } from "#/lib/seo";

export const Route = createFileRoute("/tools/image-metadata")({
	head: () => toolHead("image-metadata"),
	component: ImageMetadata,
});

interface ImageInfo {
	name: string;
	type: string;
	size: number;
	width: number;
	height: number;
	ratio: string;
	lastModified: string;
}

function ImageMetadata() {
	const [info, setInfo] = useState<ImageInfo | null>(null);
	const fileRef = useRef<HTMLInputElement>(null);

	const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
		const f = e.target.files?.[0];
		if (!f) return;
		const img = new Image();
		img.onload = () => {
			setInfo({
				name: f.name,
				type: f.type,
				size: f.size,
				width: img.naturalWidth,
				height: img.naturalHeight,
				ratio: (img.naturalWidth / img.naturalHeight).toFixed(3),
				lastModified: new Date(f.lastModified).toLocaleString(),
			});
		};
		img.src = URL.createObjectURL(f);
	};

	return (
		<ToolShell
			toolId="image-metadata"
			title="Image Metadata"
			description="Inspect image dimensions/type"
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
			{info && (
				<div className="border border-rule bg-surface divide-y divide-border">
					{(
						[
							["name", info.name],
							["type", info.type],
							["size", `${(info.size / 1024).toFixed(1)} KB`],
							["width", `${info.width}px`],
							["height", `${info.height}px`],
							["aspect ratio", info.ratio],
							["modified", info.lastModified],
						] as const
					).map(([k, v]) => (
						<div
							key={k}
							className="flex items-center justify-between px-3.5 py-2.5"
						>
							<span className="font-mono text-[10px] uppercase tracking-wide text-muted w-28">
								{k}
							</span>
							<span className="font-mono text-sm flex-1 break-all text-right">
								{v}
							</span>
						</div>
					))}
				</div>
			)}
		</ToolShell>
	);
}
