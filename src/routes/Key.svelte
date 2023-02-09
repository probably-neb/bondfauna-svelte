<script lang="ts">
    import { game_state } from "./driver"

	export let onclick: null | ((char: String) => void | undefined) = null,
		code: string = '',
        kind: string;

    let correctness: string;
    $: correctness = $game_state.chars[code];

	function clicked() {
		onclick(code);
	}
</script>

{#if kind != "spacer"}
<button on:click={game_state.send_key(code)} class="key" data-guess={correctness} data-kind={kind}>{code}</button>
{:else}
<div class="key" data-kind="spacer"></div>
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
		background-color: var(--key-bg-default);
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
