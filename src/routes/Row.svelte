<script lang="ts">
	import { range } from './utils';
	import Tile from './Tile.svelte';
	import { game_state } from './driver';
	export let row: number;
	let cols: number[]; //= range(5);
	$: cols = range($game_state.row_len);
</script>

<div class="row" style:grid-template-columns="repeat({cols.length}, 1fr)">
	{#each cols as col}
		<Tile {col} {row} />
	{/each}
</div>

<style lang="scss">
	/* $cols: 5; */
	.row {
		display: grid;
		/* grid-template-columns: repeat($cols, 1fr); */
		grid-gap: 5px;
	}
</style>
