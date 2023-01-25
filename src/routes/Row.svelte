<script lang="ts">
	import { range } from './utils';
	import Tile from './Tile.svelte';
	export let row: number;
	let cols = range(5);
</script>

<div class="row" {row}>
	{#each cols as col}
		<Tile {col} {row} />
	{/each}
</div>

<style lang="scss">
	// how to adjust cols from within app?
	$cols: 5;
	.row {
		display: grid;
		grid-template-columns: repeat($cols, 1fr);
		grid-gap: 5px;
	}
</style>
