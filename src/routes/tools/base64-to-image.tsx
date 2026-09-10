import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import ToolShell from "#/components/ToolShell";
import { toolHead } from "#/lib/seo";

export const Route = createFileRoute("/tools/base64-to-image")({
	head: () => toolHead("base64-to-image"),
	component: Base64ToImage,
});

function Base64ToImage() {
	const [input, setInput] = useState("");
	const [error, setError] = useState<string | null>(null);

	const trimmed = input.trim();
	const valid =
		!!trimmed &&
		(trimmed.startsWith("data:image/") || /^[A-Za-z0-9+/=_-]+$/.test(trimmed));

	return (
		<ToolShell
			toolId="base64-to-image"
			title="Base64 → Image"
			description="Decode Base64 into an image"
			runsLocally
		>
			<div>
				<label
					htmlFor="base64-image-input"
					className="font-mono text-[11px] uppercase tracking-wide text-muted block mb-1.5"
				>
					base64 or data uri
				</label>
				<textarea
					id="base64-image-input"
					value={input}
					onChange={(e) => {
						setInput(e.target.value);
						setError(null);
					}}
					rows={6}
					spellCheck={false}
					placeholder="data:image/png;base64,..."
					className="w-full font-mono text-sm bg-surface border border-rule rounded-none px-3.5 py-3 resize-y focus:outline-none focus:border-accent transition-tiny"
				/>
			</div>
			{trimmed && valid && (
				<div>
					<div className="font-mono text-[11px] uppercase tracking-wide text-muted mb-1.5">
						preview
					</div>
					<img
						src={
							trimmed.startsWith("data:")
								? trimmed
								: `data:image/png;base64,${trimmed}`
						}
						alt="decoded"
						className="max-w-full border border-rule bg-surface"
						onError={() => setError("invalid image data")}
					/>
				</div>
			)}
			{trimmed && !valid && (
				<div className="font-mono text-xs text-accent border-l-2 border-accent pl-3 py-1">
					not valid base64
				</div>
			)}
			{error && (
				<div className="font-mono text-xs text-accent border-l-2 border-accent pl-3 py-1">
					{error}
				</div>
			)}
		</ToolShell>
	);
}
