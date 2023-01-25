<script lang="ts">
	import Key from './Key.svelte';

	export let onclick: (code: String) => void;

	const norm = (code: String) => {
		return Array.from(code).map((c) => {
			return {
				code: c,
				kind: 'normal',
				onclick: onclick
			};
		});
	};
	const spacer = { kind: 'spacer' };
	const del = { kind: 'wide', code: 'del', onclick: onclick};
	const enter = { kind: 'wide', code: 'enter', onclick: onclick};
	const rows = [
		norm('qwertyuiop'),
		[spacer, ...norm('asdfghjkl'), spacer],
		[enter, ...norm('zxcvbnm'), del]
	];
</script>

<div class="keyboard">
	<div class="keyboard">
		{#each rows as row}
			<div class="keyboard-row">
				{#each row as key}
					<Key {...key} />
				{/each}
			</div>
        {/each}
	</div>
</div>

<style lang="scss">
	$keyboard-height: 200px;

	.keyboard {
		height: $keyboard-height;
		margin: 0 8px;
		-webkit-user-select: none;
		-moz-user-select: none;
		user-select: none;
		align-items: center;
		justify-content: center;
	}

	.keyboard-row {
		display: flex;
		width: 100%;
		margin: 0 auto 8px;
		// align-items: center;
		// justify-content: center;
		touch-action: manipulation;
	}
</style>
