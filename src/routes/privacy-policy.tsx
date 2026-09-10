import { createFileRoute } from "@tanstack/react-router";

import ToolShell from "#/components/ToolShell";
import { pageHead } from "#/lib/seo";

export const Route = createFileRoute("/privacy-policy")({
	head: () =>
		pageHead(
			"Privacy Policy",
			"tiny collects no personal data. Every tool runs entirely in your browser — nothing you type, paste, or upload is ever sent to a server.",
			"/privacy-policy",
		),
	component: PrivacyPolicy,
});

const EFFECTIVE_DATE = "September 10, 2026";

function PrivacyPolicy() {
	return (
		<ToolShell
			toolId="privacy-policy"
			title="Privacy Policy"
			description={`Effective ${EFFECTIVE_DATE}`}
		>
			<div className="space-y-8 text-sm leading-relaxed">
				<section>
					<p>
						tiny is a collection of small browser-based tools. This page
						explains, in plain terms, what happens to your data when you use it.
						Short version: nothing you type, paste, or upload in any tool ever
						leaves your browser.
					</p>
				</section>

				<section>
					<h2 className="font-mono text-[11px] uppercase tracking-widest text-muted mb-2">
						What tiny does with your input
					</h2>
					<p>
						Every tool on this site — JSON formatters, hash generators, image
						tools, everything — runs entirely as JavaScript in your own browser.
						When you paste text, upload a file, or type into a field, that data
						is processed locally on your device and is never transmitted to
						tiny's servers or anyone else's. There is no backend that receives,
						stores, or logs the content you work with.
					</p>
				</section>

				<section>
					<h2 className="font-mono text-[11px] uppercase tracking-widest text-muted mb-2">
						The only thing we store
					</h2>
					<p>
						tiny remembers your light/dark theme preference using your browser's{" "}
						<code className="font-mono text-xs bg-surface border border-rule px-1 py-0.5">
							localStorage
						</code>
						. That preference stays on your device — it's never sent to a
						server, and no other data is stored, on your device or ours.
					</p>
				</section>

				<section>
					<h2 className="font-mono text-[11px] uppercase tracking-widest text-muted mb-2">
						Cookies and tracking
					</h2>
					<p>
						tiny does not set cookies, does not use analytics or advertising
						scripts, and does not track you across sites. There are no
						third-party trackers on this site.
					</p>
				</section>

				<section>
					<h2 className="font-mono text-[11px] uppercase tracking-widest text-muted mb-2">
						Accounts and forms
					</h2>
					<p>
						tiny has no user accounts, sign-up forms, or newsletters. There is
						nothing to register for and no personal information (name, email,
						etc.) is ever requested.
					</p>
				</section>

				<section>
					<h2 className="font-mono text-[11px] uppercase tracking-widest text-muted mb-2">
						Hosting and server logs
					</h2>
					<p>
						This site is hosted on Vercel. Like any web host, Vercel's
						infrastructure may record standard server access logs for the pages
						you visit — things like IP address, user agent, and request
						timestamp — for security and operational purposes. tiny does not
						access, use, or analyze these logs. See{" "}
						<a
							href="https://vercel.com/legal/privacy-policy"
							target="_blank"
							rel="noreferrer"
							className="text-accent hover:underline"
						>
							Vercel's privacy policy
						</a>{" "}
						for details on how they handle this data.
					</p>
				</section>

				<section>
					<h2 className="font-mono text-[11px] uppercase tracking-widest text-muted mb-2">
						Children's privacy
					</h2>
					<p>
						tiny does not knowingly collect personal information from anyone,
						including children, because it does not collect personal information
						from anyone.
					</p>
				</section>

				<section>
					<h2 className="font-mono text-[11px] uppercase tracking-widest text-muted mb-2">
						Changes to this policy
					</h2>
					<p>
						If tiny's data practices ever change — for example, if a future
						feature needs a server — this page will be updated first, and the
						effective date above will change accordingly.
					</p>
				</section>

				<section>
					<h2 className="font-mono text-[11px] uppercase tracking-widest text-muted mb-2">
						Contact
					</h2>
					<p>
						Questions about this policy can be opened as an issue on{" "}
						<a
							href="https://github.com/ingfranciscastillo/tiny/issues"
							target="_blank"
							rel="noreferrer"
							className="text-accent hover:underline"
						>
							tiny's GitHub repository
						</a>
						.
					</p>
				</section>
			</div>
		</ToolShell>
	);
}
