import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import ToolShell, { OutputBlock, WorkSurface } from "#/components/ToolShell";

export const Route = createFileRoute("/tools/base64-converter")({
	component: Base64Tool,
});

type Mode = "encode" | "decode";

function Base64Tool() {
	const [mode, setMode] = useState<Mode>("encode");
	const [input, setInput] = useState("");

	let output = "";
	let error: string | null = null;
	if (input) {
		try {
			if (mode === "encode") {
				const bytes = new TextEncoder().encode(input);
				let bin = "";
				bytes.forEach((b) => {
					bin += String.fromCharCode(b);
				});
				output = btoa(bin);
			} else {
				const bin = atob(input.trim());
				const bytes = Uint8Array.from(bin, (c) => c.charCodeAt(0));
				output = new TextDecoder().decode(bytes);
			}
		} catch {
			error = `invalid input for ${mode}`;
		}
	}

	return (
		<ToolShell
			toolId="base64"
			title="Base64"
			description="Encode or decode Base64 text"
			runsLocally
		>
			<div className="flex items-center gap-1">
				{(["encode", "decode"] as const).map((m) => (
					<button
						key={m}
						type="button"
						onClick={() => setMode(m)}
						className={`font-mono text-xs uppercase tracking-wide px-3 py-1.5 border border-rule transition-tiny ${
							mode === m ? "bg-accent-soft text-accent" : "hover:text-accent"
						}`}
					>
						{m}
					</button>
				))}
			</div>

			<WorkSurface
				label={mode === "encode" ? "plain text" : "base64"}
				value={input}
				onChange={(e) => setInput(e.target.value)}
				placeholder={mode === "encode" ? "text to encode" : "base64 to decode"}
				rows={8}
			/>

			{error && (
				<div className="font-mono text-xs text-accent border-l-2 border-accent pl-3 py-1">
					{error}
				</div>
			)}

			<OutputBlock
				value={error ? "" : output}
				placeholder="output appears here"
				copyLabel="Copy"
			/>
		</ToolShell>
	);
}
