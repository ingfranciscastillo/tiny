import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";

import ToolShell, { OutputBlock } from "#/components/ToolShell";
import { toolHead } from "#/lib/seo";

export const Route = createFileRoute("/tools/data-uri-generator")({
	head: () => toolHead("data-uri-generator"),
	component: DataUriGenerator,
});

interface FileInfo {
	name: string;
	type: string;
	size: number;
}

function DataUriGenerator() {
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
			toolId="data-uri-generator"
			title="Data URI Generator"
			description="File → Data URI"
			runsLocally
		>
			<div className="flex items-center gap-2">
				<button
					type="button"
					onClick={() => fileRef.current?.click()}
					className="font-mono text-xs uppercase tracking-wide px-3 py-1.5 border border-rule rounded-none transition-tiny hover:text-accent hover:border-accent"
				>
					Choose file
				</button>
				<input ref={fileRef} type="file" onChange={onFile} className="hidden" />
				{info && (
					<span className="font-mono text-xs text-muted">
						{info.name} · {(info.size / 1024).toFixed(1)} KB
					</span>
				)}
			</div>
			<OutputBlock
				value={out || ""}
				placeholder="data:image/png;base64,..."
				copyLabel="Copy"
			/>
		</ToolShell>
	);
}
