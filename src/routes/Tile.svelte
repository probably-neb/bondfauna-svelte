<script lang="ts">
	import { board, game_state, defaultTileState } from './driver';
	import type { TileState, GameState } from './driver';
	import { fade } from 'svelte/transition';
	export let col: number, row: number;

	let state: TileState;

	$: state = $board[row][col] ?? defaultTileState();
</script>

<div class="tile" data-guess={state.correctness}>{state.char}</div>

<style lang="scss">
	@import './reactive_colors.scss';
	.tile {
		aspect-ratio: 1;
		width: 100%;
		display: inline-flex;
		justify-content: center;
		align-items: center;
		font-size: 150%;
		line-height: 1;
		font-weight: bold;
		vertical-align: middle;
		box-sizing: border-box;
		text-transform: uppercase;
		-webkit-user-select: none;
		-moz-user-select: none;
		user-select: none;
		color: var(--text-color);
	}

	.tile::before {
		content: ' ';
		display: inline-block;
		padding-bottom: 100%;
	}
</style>
