<script lang="ts">
	import { game_state } from './driver';
	// multilevel dropdown menu if needed
	// https://svelte.dev/repl/814c27da2e1344f9b4f205a93e02559f?version=3.38.1k
	import ResetIcon from '$lib/icons/reset.svelte';
	import PaintIcon from '$lib/icons/paintbrush.svelte';
	import LenIcon from '$lib/icons/lengths.svelte';

	export let changeTheme;

	let theme = 'dark';
	let theme_changed = false;
	const themes = ['dark', 'light', 'pink'];

	$: if (theme_changed) {
		console.log('theme changed to ' + theme);
		changeTheme(theme);
	} else {
		theme_changed = true;
	}
	// $: difficulty = $game_state.difficulty;
	let difficulty = 5;
	let difficulty_changed = false;
	const difficulties = [4, 5, 6, 7, 8, 9];

	$: if (difficulty_changed) {
		// last_difficulty = difficulty;
		console.log('difficulty changed to ' + difficulty);
		game_state.change_difficulty(difficulty);
	} else {
		difficulty_changed = true;
	}

	import { getNotificationsContext } from 'svelte-notifications';
	const { clearNotifications } = getNotificationsContext();
	async function reset() {
		console.log('reset pressed');
		clearNotifications();
		await game_state.reset(difficulty);
	}
</script>

<div class="appHeader">
	<div class="menuLeft">
		<label for="difficulty"><LenIcon /></label>
		<select id="difficulty" bind:value={difficulty}>
			{#each difficulties as d}
				<option value={d}>{d}</option>
			{/each}
		</select>
		<label for="theme"><PaintIcon /></label>
		<select id="theme" bind:value={theme}>
			{#each themes as t}
				<option value={t}>{t}</option>
			{/each}
		</select>
	</div>
	<div class="appHeader-title">Jordle</div>
	<div class="menuRight">
		<!-- This is a hack to prevent reset from being called twice -->
		{#if $game_state.current.row > 0 || $game_state.current.col > 0}
			<button on:click|once={reset} class="icon">
				<ResetIcon />
			</button>
		{:else}
			<div class="icon">
				<ResetIcon />
			</div>
		{/if}
	</div>
</div>

<style lang="scss">
	.appHeader {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: flex-start;
		flex-wrap: nowrap;
		padding: 0px var(--header-padding-x);
		height: var(--header-height);
		color: var(--text-color);
		border-bottom: 1px solid var(--highlight-color);

		button:focus-visible {
			outline: 2px solid var(--highlight-color);
		}

		.icon {
			background: none;
			border: none;
			cursor: pointer;
			padding: 0 4px;
		}

		.icon:last-child {
			padding-right: 0;
		}
	}

	svg {
		path {
			fill: var(--text-color);
		}
	}

	.reset-icon {
		object-fit: contain;
		height: 24px;
		height: 24px;
		/* color: var(--text-color); */
		/* -webkit-filter: invert(100%); */
		/* filter: invert(100%); */
		// viewBox: 4 4 24 24;
	}

	.appHeader-title {
		flex-grow: 2;
		// font-family: 'nyt-karnakcondensed';
		color: var(--text-color);
		font-weight: 700;
		font-size: 28px;
		letter-spacing: 0.01em;
		// text-align: left;
		text-align: center;
		padding-left: 10px;
		left: 0;
		right: 0;
		pointer-events: none;
		position: relative;
	}

	.menuLeft {
		display: flex;
		margin: 0;
		padding: 0;
		align-items: center;
		justify-content: flex-start;
		flex-flow: row;
		flex-direction: row;
	}

	.menuRight {
		display: flex;
		justify-content: flex-end;
	}

	#navButton {
		padding-top: 2px;
		padding-left: 0px;
		padding-right: 13px;
	}

	@media (min-width: 1024px) {
		.appHeader {
			.title {
				text-align: center;
				font-size: 36px;
			}

			button.icon {
				padding: 0 6px;
			}
		}
	}

	@media (min-width: 768px) {
		.appHeader {
			.title {
				text-align: center;
				font-size: 32px;
			}

			.menuLeft,
			.menuRight {
				// these two must be exactly the same width for the title to be centered
				width: 120px;
			}
		}

		@media (min-width: 1024px) {
			.appHeader .title {
				font-size: 36px;
			}
		}

		#navButton {
			padding-top: 2px;
			padding-left: 0px;
		}
	}

	select {
		/* width: 140px; */
		/* height: 35px; */
		/* padding: 5px 35px 5px 5px; */
		/* font-size: 18px; */
		margin: 0 10px 0 10px;
		border: 2px solid #ccc;
		-webkit-appearance: none;
		-moz-appearance: none;
		appearance: none;
		background-color: var(--bg-color);
		color: var(--text-color);
		/* background: url("/uploads/media/default/0001/02/f7b4d3d2ba3fe1d8518e6e63d7740e1e73921abf.png") 96% / 15% no-repeat #eee; */
	}
</style>
