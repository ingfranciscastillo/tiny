import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import ToolShell, { OutputBlock, WorkSurface } from "#/components/ToolShell";
import { toolHead } from "#/lib/seo";

export const Route = createFileRoute("/tools/binary-converter")({
	head: () => toolHead("binary"),
	component: BinaryConverter,
});

type Mode = "encode" | "decode";

function BinaryConverter() {
	const [mode, setMode] = useState<Mode>("encode");
	const [input, setInput] = useState("");

	let output = "";
	let error: string | null = null;
	if (input) {
		try {
			if (mode === "encode") {
				output = Array.from(new TextEncoder().encode(input))
					.map((b) => b.toString(2).padStart(8, "0"))
					.join(" ");
			} else {
				const parts = input.trim().split(/\s+/);
				const bytes = parts.map((p) => {
					if (!/^[01]+$/.test(p)) throw new Error("invalid binary digit");
					return Number.parseInt(p, 2);
				});
				output = new TextDecoder().decode(Uint8Array.from(bytes));
			}
		} catch (e) {
			error = e instanceof Error ? e.message : String(e);
		}
	}

	return (
		<ToolShell
			toolId="binary"
			title="Binary Converter"
			description="Convert between text and binary"
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
				placeholder={mode === "encode" ? "text" : "01101000 01100101"}
				rows={5}
			/>
			{error && (
				<div className="font-mono text-xs text-accent border-l-2 border-accent pl-3 py-1">
					{error}
				</div>
			)}
			<OutputBlock
				value={error ? "" : output}
				placeholder="binary output"
				copyLabel="Copy"
			/>
		</ToolShell>
	);
}
