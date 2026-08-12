<script lang="ts">
	/**
	 * A quiet word — port of the production blog's `ReflectionPrompt`.
	 *
	 * The last thing the apparatus asks: one question, one box, and it goes to
	 * the author alone. It writes to the same `/api/react` table as a mark's
	 * note, with `reaction: 'letter'`, so both editions collect the same thing.
	 *
	 * The question is chosen by the slug, not at random: an essay always asks
	 * the same one, and it is the same one production asks, because the index is
	 * the same sum over the same slug.
	 */
	import { dev } from '$app/environment';
	import Tag from '$lib/components/ink/Tag.svelte';
	import { useI18n } from '$lib/i18n';
	import { sessionId } from '$lib/session';

	let { slug, draft = false }: { slug: string; draft?: boolean } = $props();

	const i18n = useI18n();
	const t = $derived(i18n.t.reflection);

	const prompt = $derived.by(() => {
		const sum = [...slug].reduce((a, c) => a + c.charCodeAt(0), 0);
		return t.prompts[sum % t.prompts.length];
	});

	let text = $state('');
	let status = $state<'idle' | 'sending' | 'sent' | 'failed'>('idle');

	async function submit() {
		if (!text.trim() || status === 'sending') return;

		// A draft has no readers, so nothing it collects would be real. In dev the
		// endpoint has no database behind it; the same rule ReaderMarks uses.
		if (dev || draft) {
			status = 'sent';
			return;
		}

		status = 'sending';
		try {
			const res = await fetch('/api/react', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					postSlug: slug,
					passage: prompt,
					reaction: 'letter',
					note: text,
					locale: i18n.lang,
					sessionId: sessionId()
				})
			});
			// The reader wrote something and pressed send — if it did not land, say
			// so, rather than thanking them for a letter that was dropped.
			status = res.ok ? 'sent' : 'failed';
		} catch {
			status = 'failed';
		}
	}
</script>

{#if status === 'sent'}
	<p class="received">{t.sent}</p>
{:else}
	<section class="plate">
		<div class="head">
			<Tag on>{t.label}</Tag>
			<Tag>{t.privacy}</Tag>
		</div>
		<p class="prompt">{prompt}</p>
		<div class="say">
			<textarea
				bind:value={text}
				placeholder={t.placeholder}
				rows="4"
				aria-label={prompt}
				disabled={status === 'sending'}
			></textarea>
			<div class="foot">
				{#if status === 'failed'}
					<span class="failed">{t.failed}</span>
				{:else}
					<span></span>
				{/if}
				<button onclick={submit} disabled={!text.trim() || status === 'sending'}>
					{status === 'sending' ? t.sending : t.send}
				</button>
			</div>
		</div>
	</section>
{/if}

<style>
	/* The plate the apparatus ends on — same frame as "one sentence", so the
	   author's last word and the reader's first sit in the same kind of box. */
	.plate {
		border: 1.5px solid var(--rule-hard);
		margin: 38px 0 34px;
	}
	.head {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
		gap: 16px;
		flex-wrap: wrap;
		padding: 10px 16px;
		border-bottom: 1px solid var(--rule);
	}
	.prompt {
		font-family: var(--display);
		font-weight: 500;
		font-size: 24px;
		line-height: 1.15;
		letter-spacing: -0.02em;
		text-transform: lowercase;
		color: var(--ink);
		margin: 0;
		padding: 22px 22px 0;
		text-wrap: pretty;
	}
	.say {
		padding: 16px 22px 20px;
	}

	textarea {
		display: block;
		width: 100%;
		box-sizing: border-box;
		background: var(--paper2);
		border: 1px solid var(--rule);
		border-radius: 0;
		padding: 12px 14px;
		font-family: var(--reading-font);
		font-size: 15px;
		line-height: 1.6;
		color: var(--ink);
		resize: vertical;
	}
	textarea:focus {
		outline: none;
		border-color: var(--blue);
	}
	textarea:disabled {
		opacity: 0.6;
	}

	.foot {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 16px;
		margin-top: 12px;
	}
	/* Hairline box, MONO caps, colour flip on hover — the theme's one button
	   shape (§8). No fill: this is an offer, not a call to action. */
	button {
		background: transparent;
		border: 1.5px solid var(--ink);
		border-radius: 0;
		padding: 7px 16px;
		font-family: var(--mono);
		font-size: 10px;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--ink);
		cursor: pointer;
		transition:
			border-color 0.15s,
			color 0.15s;
	}
	button:hover:not(:disabled) {
		border-color: var(--blue);
		color: var(--blue);
	}
	button:disabled {
		opacity: 0.45;
		cursor: default;
	}
	.failed {
		font-family: var(--mono);
		font-size: 10.5px;
		letter-spacing: 0.06em;
		color: var(--blue);
	}

	/* Afterwards the box is gone: one line where it stood, and the page moves on. */
	.received {
		margin: 38px 0 34px;
		padding: 22px 0;
		border-top: 1px solid var(--rule);
		font-family: var(--mono);
		font-size: 11px;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--muted);
		text-align: center;
	}

	@media (max-width: 720px) {
		.prompt {
			font-size: 20px;
			padding: 18px 16px 0;
		}
		.say {
			padding: 14px 16px 18px;
		}
		.foot {
			flex-wrap: wrap;
		}
	}
</style>
