<script lang="ts">
	import Row from './Row.svelte';
	import { onMount } from 'svelte';
	import { range } from './utils';
	import { game_state } from './driver';
	import Tile from './Tile.svelte';
	import { fade } from 'svelte/transition';
	import { get } from 'svelte/store';
	import { request_update, is_valid_guess } from '$lib/firebase/api';

	import ReportIcon from '$lib/report.svelte';
	// TODO: look at crossfade transition, it may
	// be the key to making changing the board size
	// happen smoothly

	// in order to crossfade must matching elems must be on percentage
	// distance from center of grid rounded to int

	let rows: number;
	let cols: number;
	$: cols = $game_state.row_len;
	$: rows = $game_state.max_guesses;

	// TODO: move this to driver
	async function recheck() {
		await game_state.update((gs) => {
			gs.check({ force: true });
			gs.guessed.just_did = false;
			return gs;
		});
	}

	import { getNotificationsContext } from 'svelte-notifications';
	const { addNotification } = getNotificationsContext();

	let just_guessed_invalid: boolean;

	$: {
		const { valid, just_did } = $game_state.guessed;
		just_guessed_invalid = just_did && !valid;
	}

	// TODO: make custom notification object with button to report
	// word as missing
	$: if (just_guessed_invalid) {
		addNotification({
			text: 'Invalid Guess. Click the yellow warning icon to report the word as missing!',
			type: 'warning',
			position: 'top-right',
			removeAfter: 3000
		});
	}

	async function report() {
		const {
			current,
			guessed: { guess, valid }
		} = get(game_state);
		const action = valid ? 'remove' : 'add';
		await request_update(guess, action);

		// TODO: consider the implications of this
		await recheck();
	}
	$: if ($game_state.done) {
		console.log('game over');
		const won = $game_state.won;
		const type = won ? 'success' : 'error';
		const text = won ? 'You Win!' : 'Game Over!\nThe answer was: ' + $game_state.answer;
		addNotification({
			text,
			type,
			position: 'top-center',
			removeAfter: 100000
		});
	}
</script>

<div class="board" style:grid-template-columns="repeat({cols}, 1fr)">
	{#each range(cols) as col}
		<div
			in:fade={{ duration: col * 100 }}
			class="row"
			style:grid-template-rows="repeat({rows}, 1fr)"
		>
			{#each range(rows) as row}
				{#if col == cols - 1}
					<div class="report">
						<Tile {col} {row} />
						{#if $game_state.current.row == row && just_guessed_invalid}
							<button style:right="{(9 - cols) * 3}%" on:click={report}>
								<ReportIcon />
							</button>
						{/if}
					</div>
				{:else}
					<Tile {col} {row} />
				{/if}
			{/each}
		</div>
	{/each}
</div>

<style lang="scss">
	.report {
		button {
			float: right;
			z-index: 2;
			position: absolute;
			background: var(--guess-misplaced);
			border: none;
			display: flex;
			align-items: center;
			justify-items: center;
			border-radius: 50%;
			aspect-ratio: 1;
			transition: transform 0.18s ease-in-out;
		}
		button:hover {
			transform: scale(1.3);
		}
		display: flex;
		flex-direction: row;
	}
	.row {
		display: grid;
		grid-gap: 5px;
		min-width: 0;
		min-height: 0;
	}
	.board {
		width: 100%;
		height: 100%;
		display: grid;
		grid-gap: 5px;
		grid-auto-flow: column;
	}
</style>
