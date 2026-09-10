import { useCallback, useState } from "react";

interface CopyButtonProps {
	value: string | null | undefined;
	label?: string;
	className?: string;
}

// Tiny copy button with a fast "copied" confirmation that fades automatically.
export default function CopyButton({
	value,
	label = "Copy",
	className = "",
}: CopyButtonProps) {
	const [status, setStatus] = useState<"idle" | "copied" | "error">("idle");

	const copy = useCallback(async () => {
		if (value == null || value === "") return;
		try {
			await navigator.clipboard.writeText(value);
			setStatus("copied");
		} catch {
			// navigator.clipboard is unavailable (non-secure context, unsupported
			// browser, or denied permission) — surface it instead of masking the
			// failure with the deprecated document.execCommand("copy") API.
			setStatus("error");
		}
		setTimeout(() => setStatus("idle"), 1400);
	}, [value]);

	return (
		<button
			type="button"
			onClick={copy}
			disabled={value == null || value === ""}
			className={`font-mono text-xs uppercase tracking-wide px-3 py-1.5 border border-rule rounded-none transition-tiny disabled:opacity-30 disabled:cursor-not-allowed hover:text-accent hover:border-accent ${className}`}
		>
			{status === "copied"
				? "✓ copied"
				: status === "error"
					? "✗ failed"
					: label}
		</button>
	);
}
