<script lang="ts">
	import { game_state } from './driver';
	import ResetIcon from '$lib/reset.svg?component';

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

	async function reset() {
		console.log('reset pressed');
		await game_state.reset(difficulty);
	}
</script>

<div class="appHeader">
	<div class="menuLeft">
		<div id="dropdown">
			<select bind:value={difficulty}>
				{#each difficulties as d}
					<option value={d}>{d}</option>
				{/each}
			</select>
		</div>
		<select bind:value={theme}>
			{#each themes as t}
				<option value={t}>{t}</option>
			{/each}
		</select>
	</div>
	<div class="appHeader-title">Jordle</div>
	<div class="menuRight">
		<button on:click={reset} class="icon">
			<ResetIcon width="24px" height="24px" color="var(--text-color)" />
		</button>
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

		button.icon {
			background: none;
			border: none;
			cursor: pointer;
			padding: 0 4px;
		}

		button.icon:last-child {
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
</style>
