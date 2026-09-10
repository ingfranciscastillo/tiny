import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import ToolShell, { OutputBlock, WorkSurface } from "#/components/ToolShell";

export const Route = createFileRoute("/tools/rot13-cipher")({
	component: Rot13,
});

function Rot13() {
	const [input, setInput] = useState("");
	const output = input.replace(/[a-z]/gi, (c) => {
		const code = c.charCodeAt(0);
		const base = code <= 90 ? 65 : 97;
		return String.fromCharCode(((code - base + 13) % 26) + base);
	});

	return (
		<ToolShell
			toolId="rot13"
			title="ROT13"
			description="Rotate letters by 13 positions"
			runsLocally
		>
			<WorkSurface
				label="input"
				value={input}
				onChange={(e) => setInput(e.target.value)}
				placeholder="text to rotate"
				rows={6}
			/>
			<OutputBlock value={output} placeholder="rotated text" copyLabel="Copy" />
		</ToolShell>
	);
}
