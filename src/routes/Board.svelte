<script lang="ts">
	import Row from './Row.svelte';
	import { onMount } from 'svelte';
	import { range } from './utils';

	let h: number, r: number = 300, l: number=360, n: number;
	function calculateSize() {
		r = ((n = Math.floor(h * (5 / 6))), Math.min(Math.max(n, 300), 350));
		l = 6 * Math.floor(r / 5);
	}
	let rows = range(6);

	onMount(calculateSize);
    // function compute() {
    //     return Evaluator.compute("crate","jacky");
    // }
</script>

<div class="board-outer" id="board-container" bind:clientHeight={h}>
	<div class="board-inner" style="width: {r}px; height: {l}px;">
		{#each rows as row}
			<Row {row} />
		{/each}
	</div>
</div>

<style lang="scss">
	.board-outer {
		display: flex;
		justify-content: center;
		align-items: center;
		flex-grow: 1;
		overflow: hidden;
		overflow-x: hidden;
		overflow-y: hidden;
	}

	.board-inner {
		display: grid;
		grid-template-rows: repeat(6, 1fr);
		grid-gap: 5px;
		padding: 10px;
		box-sizing: border-box;
	}
</style>
