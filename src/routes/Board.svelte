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

	// export let row: number;
	// let cols: number[]; //= range(5);
	// $: cols = range($game_state.row_len);

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

	// onMount(calculateSize);
	// function compute() {
	//     return Evaluator.compute("crate","jacky");
	// }
</script>

<!-- <div class="board-outer" id="board-container" bind:clientHeight={clientHeight}> -->
<!-- <div class="board-inner" style:width="{w}px" style:height="{h}px" style:grid-template-rows="repeat({rows},1fr)"> -->
<!-- <div class="board-inner" style:grid-template-rows="repeat({rows},1fr)"> -->
<div class="board">
	{#each range(rows) as row}
		<div class="row" style:grid-template-columns="repeat({cols}, 1fr)">
			{#each range(cols) as col}
				<Tile {col} {row} />
			{/each}
		</div>
	{/each}
</div>
<!-- </div> -->

<!-- .board-outer { -->
<!-- 	display: flex; -->
<!--        width: 100%; -->
<!-- 	justify-content: center; -->
<!-- 	align-items: center; -->
<!-- 	flex-grow: 1; -->
<!-- 	overflow: hidden; -->
<!-- 	overflow-x: hidden; -->
<!-- 	overflow-y: hidden; -->
<!-- } -->
<!---->
<!-- .board-inner { -->
<!-- 	display: grid; -->
<!--        margin: 5% auto; -->
<!--        height: 70%; -->
<!--        /* width: 70%; */ -->
<!-- 	/* grid-template-rows: repeat(6, 1fr); */ -->
<!-- 	grid-gap: 5px; -->
<!-- 	padding: 10px; -->
<!-- 	box-sizing: border-box; -->
<!-- } -->

<!-- </div> -->
<style lang="scss">
	.row {
		display: grid;
		/* grid-template-columns: repeat($cols, 1fr); */
		grid-gap: 5px;
	}
	.board {
		width: 100%;
		height: 100%;
		display: grid;
		grid-gap: 5px;
	}
</style>
