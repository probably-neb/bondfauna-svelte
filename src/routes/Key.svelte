<script lang="ts">
	import { game_state, char_states, defaultCorrectness } from './driver';
	import type { GameState } from './driver';

	export let code: string = '',
		kind: string;

	const name = code === 'backspace' ? 'del' : code;

	let correctness: string = defaultCorrectness();

	// async function updateCorrectness(gs: Promise<GameState>) {
	//     correctness = await gs.then(g => g.chars[code]);
	// }

	$: correctness = $char_states[code];

	// $: updateCorrectness($game_state);

	// function clicked() {
	// 	onclick(code);
	// }
</script>

{#if kind != 'spacer'}
	<button
		on:click={game_state.send_key(code)}
		class="key"
		data-guess={correctness}
		data-kind={kind}
		data-key={code}>{name}</button
	>
{:else}
	<div class="key" data-kind="spacer" />
{/if}

<style lang="scss">
	@import './reactive_colors.scss';

	.key {
		font-family: inherit;
		font-weight: bold;
		border: 0;
		padding: 0;
		margin: 0 6px 0 0;
		height: 58px;
		border-radius: 4px;
		cursor: pointer;
		-webkit-user-select: none;
		-moz-user-select: none;
		user-select: none;
		background-color: var(--key-bg);
		color: var(--key-text-color);
		display: flex;
		justify-content: center;
		align-items: center;
		text-transform: uppercase;
		-webkit-tap-highlight-color: rgba(0, 0, 0, 0.3);
	}

	.key[data-kind='spacer'] {
		flex: 0.5;
		background-color: transparent;
		color: transparent;
	}
	.key[data-kind='normal'] {
		flex: 1;
	}

	.key[data-kind='wide'] {
		flex: 1.5;
	}
</style>
