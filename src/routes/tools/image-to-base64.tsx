import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";
import CopyButton from "#/components/CopyButton";
import ToolShell from "#/components/ToolShell";
import { toolHead } from "#/lib/seo";

export const Route = createFileRoute("/tools/image-to-base64")({
	head: () => toolHead("image-to-base64"),
	component: ImageToBase64,
});

interface FileInfo {
	name: string;
	type: string;
	size: number;
}

function ImageToBase64() {
	const [out, setOut] = useState<string | null>(null);
	const [info, setInfo] = useState<FileInfo | null>(null);
	const fileRef = useRef<HTMLInputElement>(null);

	const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
		const f = e.target.files?.[0];
		if (!f) return;
		setInfo({ name: f.name, type: f.type, size: f.size });
		const reader = new FileReader();
		reader.onload = () => setOut(reader.result as string);
		reader.readAsDataURL(f);
	};

	return (
		<ToolShell
			toolId="image-to-base64"
			title="Image → Base64"
			description="Encode an image as a data URI"
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
				{info && (
					<span className="font-mono text-xs text-muted">
						{info.name} · {(info.size / 1024).toFixed(1)} KB
					</span>
				)}
			</div>

			{out && (
				<div className="flex items-start gap-4">
					<img
						src={out}
						alt="preview"
						className="w-24 h-24 object-cover border border-rule bg-surface"
					/>
					<div className="flex-1 min-w-0">
						<div className="flex items-center justify-between mb-1.5">
							<span className="font-mono text-[11px] uppercase tracking-wide text-muted">
								data uri
							</span>
							<CopyButton value={out} label="copy" />
						</div>
						<pre className="font-mono text-xs bg-surface border border-rule px-3.5 py-3 break-all whitespace-pre-wrap max-h-48 overflow-auto">
							{out.slice(0, 200)}…
						</pre>
					</div>
				</div>
			)}
		</ToolShell>
	);
}
