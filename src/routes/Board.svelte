<script lang="ts">
	import Row from './Row.svelte';
	import { onMount } from 'svelte';
	import { range } from './utils';
	import { game_state } from './driver';
	import Tile from './Tile.svelte';

	let rows: number;
	let cols: number;
	$: cols = $game_state.row_len;
	$: rows = $game_state.max_guesses;

    // TODO: separate rows into their own component with the report 
    // functionality

	let clientHeight: number,
		w: number = 300,
		h: number = 360,
		n: number;
	function calculateSize() {
		const num = cols,
			dem = rows;
		const low = 50 * dem,
			high = low + 50;
		let n = Math.floor(clientHeight * (num / dem));
		w = Math.min(Math.max(n, num * 50), dem * 50);
		h = dem * Math.floor(w / num);
	}

</script>

<div class="board">
	{#each range(rows) as row}
		<div class="row" style:grid-template-columns="repeat({cols}, 1fr)">
			{#each range(cols) as col}
				<Tile {col} {row} />
			{/each}
		</div>
	{/each}
</div>

<style lang="scss">
	.row {
		display: grid;
		grid-gap: 5px;
	}
	.board {
		width: 100%;
		height: 100%;
		display: grid;
		grid-gap: 5px;
	}
</style>
