<script lang="ts">
	import Row from './Row.svelte';
	import { onMount } from 'svelte';
	import { range } from './utils';
	import { game_state } from './driver';
	import Tile from './Tile.svelte';
	import { fade } from 'svelte/transition';
    import { get } from 'svelte/store';

    import ReportIcon from '$lib/report.svelte';
    // TODO: look at crossfade transition, it may 
    // be the key to making changing the board size 
    // happen smoothly
    // 
    // in order to crossfade must matching elems must be on percentage
    // distance from center of grid rounded to int

	let rows: number;
	let cols: number;
	$: cols = $game_state.row_len;
	$: rows = $game_state.max_guesses;

    async function report(row: number) {
        const word = get(game_state).word_at_row(row);
        const valid = await fetch('/api/wordbank', {
            method: 'POST',
            body: word,
        }).then(res => res.json());
        const action  = valid ? 'remove' : 'add' ;

        // await fetch('/api/report', {
        //     method: 'POST',
        //     body: JSON.stringify({ word, action}),
        //     headers: {
        //         'content-type': 'application/json'
        //     }
        // });
        console.log(action,word);
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
                {#if col == cols - 1 }
                    <div class="report" >
                    <Tile {col} {row} />
                    <button style:right="{(9-cols)*3}%" on:click={() => report(row)}>
                            <ReportIcon/>
                    </button>
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
