<script lang="ts">
	import Key from './Key.svelte';

	// export let onclick: (code: String) => void;

	const norm = (code: String) => {
		return Array.from(code).map((c) => {
			return {
				code: c,
				kind: 'normal',
				// onclick: onclick
			};
		});
	};
	const spacer = { kind: 'spacer' };
	const del = { kind: 'wide', code: 'backspace'};
	const enter = { kind: 'wide', code: 'enter'};
	const rows = [
		norm('qwertyuiop'),
		[spacer, ...norm('asdfghjkl'), spacer],
		[enter, ...norm('zxcvbnm'), del]
	];
</script>


<div class="keyboard">
    {#each rows as row}
        <div class="keyboard-row">
            {#each row as key}
            <Key {...key} />
            {/each}
        </div>
    {/each}
</div>


<style lang="scss">
	$keyboard-height: 200px;

	.keyboard {
		/* height: $keyboard-height; */
		/* max-width: var(--game-max-width); */
        /* width: 90%; */
        /* height: 20%; */
		/* margin: 5%; */
        /* padding-bottom: 8px; */
		-webkit-user-select: none;
		-moz-user-select: none;
		user-select: none;
		align-items: center;
		justify-content: center;
        /* padding-bottom: 8px; */
	}

	.keyboard-row {
		display: flex;
		width: 100%;
		margin: 0 auto 8px;
		align-items: center;
		// justify-content: center;
		touch-action: manipulation;
	}
</style>
