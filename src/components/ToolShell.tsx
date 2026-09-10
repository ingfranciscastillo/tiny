import { Link } from "@tanstack/react-router";
import type { ChangeEvent, ReactNode } from "react";

import CopyButton from "#/components/CopyButton";

interface ToolShellProps {
	toolId: string;
	title: string;
	description: string;
	runsLocally?: boolean;
	children: ReactNode;
	actions?: ReactNode;
}

// Shared layout for a single tool page: back link, title, description, children.
export default function ToolShell({
	title,
	description,
	runsLocally,
	children,
	actions,
}: ToolShellProps) {
	return (
		<div className="max-w-3xl mx-auto px-5 sm:px-6 py-10 sm:py-16">
			<div className="flex items-center justify-between mb-10">
				<Link
					to="/"
					className="font-mono text-sm text-muted hover:text-accent transition-tiny flex items-center gap-2"
				>
					← tiny
				</Link>
				{runsLocally && (
					<span className="font-mono text-[11px] uppercase tracking-wide text-muted">
						runs locally
					</span>
				)}
			</div>

			<h1 className="font-heading text-2xl font-semibold tracking-tight mb-1.5">
				{title}
			</h1>
			<p className="text-sm text-muted mb-8">{description}</p>

			<div className="space-y-6">{children}</div>

			{actions && (
				<div className="flex items-center gap-2 mt-6 justify-end">
					{actions}
				</div>
			)}
		</div>
	);
}

interface WorkSurfaceProps {
	value: string;
	onChange?: (e: ChangeEvent<HTMLTextAreaElement>) => void;
	placeholder?: string;
	rows?: number;
	readOnly?: boolean;
	label?: string;
}

// A technical text surface — bordered work area, monospace, no card chrome.
export function WorkSurface({
	value,
	onChange,
	placeholder,
	rows = 10,
	readOnly = false,
	label,
}: WorkSurfaceProps) {
	return (
		<div>
			{label && (
				<div className="font-mono text-[11px] uppercase tracking-wide text-muted mb-1.5">
					{label}
				</div>
			)}
			<textarea
				value={value}
				onChange={onChange}
				placeholder={placeholder}
				rows={rows}
				readOnly={readOnly}
				spellCheck={false}
				className="w-full font-mono text-sm leading-relaxed bg-surface border border-rule rounded-none px-3.5 py-3 resize-y focus:outline-none focus:border-accent transition-tiny placeholder:text-muted/60"
			/>
		</div>
	);
}

interface OutputBlockProps {
	value: string;
	placeholder?: string;
	copyLabel?: string;
	downloadName?: string;
}

// Output block: monospace pre with optional copy + download.
export function OutputBlock({
	value,
	placeholder = "",
	copyLabel = "Copy",
	downloadName,
}: OutputBlockProps) {
	const download = () => {
		if (!value) return;
		const blob = new Blob([value], { type: "text/plain" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = downloadName || "tiny-output.txt";
		a.click();
		URL.revokeObjectURL(url);
	};

	return (
		<div>
			<div className="font-mono text-[11px] uppercase tracking-wide text-muted mb-1.5 flex items-center justify-between">
				<span>output</span>
				<div className="flex items-center gap-2">
					<CopyButton value={value} label={copyLabel} />
					{downloadName && (
						<button
							type="button"
							onClick={download}
							disabled={!value}
							className="font-mono text-xs uppercase tracking-wide px-3 py-1.5 border border-rule rounded-none transition-tiny disabled:opacity-30 hover:text-accent hover:border-accent"
						>
							Download
						</button>
					)}
				</div>
			</div>
			<pre className="w-full font-mono text-sm leading-relaxed bg-surface border border-rule rounded-none px-3.5 py-3 min-h-[80px] whitespace-pre-wrap break-all overflow-auto">
				{value || <span className="text-muted/50">{placeholder}</span>}
			</pre>
		</div>
	);
}
