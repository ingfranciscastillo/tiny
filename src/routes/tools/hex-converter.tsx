import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import ToolShell, { OutputBlock, WorkSurface } from "#/components/ToolShell";
import { toolHead } from "#/lib/seo";

export const Route = createFileRoute("/tools/hex-converter")({
	head: () => toolHead("hex"),
	component: HexConverter,
});

type Mode = "encode" | "decode";

function HexConverter() {
	const [mode, setMode] = useState<Mode>("encode");
	const [input, setInput] = useState("");

	let output = "";
	let error: string | null = null;
	if (input) {
		try {
			if (mode === "encode") {
				output = Array.from(new TextEncoder().encode(input))
					.map((b) => b.toString(16).padStart(2, "0"))
					.join(" ");
			} else {
				const clean = input.replace(/[^0-9a-fA-F]/g, "");
				if (clean.length % 2 !== 0) throw new Error("odd number of hex digits");
				const bytes = new Uint8Array(clean.length / 2);
				for (let i = 0; i < bytes.length; i++)
					bytes[i] = Number.parseInt(clean.slice(i * 2, i * 2 + 2), 16);
				output = new TextDecoder().decode(bytes);
			}
		} catch (e) {
			error = e instanceof Error ? e.message : String(e);
		}
	}

	return (
		<ToolShell
			toolId="hex"
			title="Hex Converter"
			description="Convert between text and hexadecimal"
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
				label="input"
				value={input}
				onChange={(e) => setInput(e.target.value)}
				placeholder={mode === "encode" ? "text" : "68 65 6c 6c 6f"}
				rows={5}
			/>
			{error && (
				<div className="font-mono text-xs text-accent border-l-2 border-accent pl-3 py-1">
					{error}
				</div>
			)}
			<OutputBlock
				value={error ? "" : output}
				placeholder="hex output"
				copyLabel="Copy"
			/>
		</ToolShell>
	);
}
