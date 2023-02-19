<script lang="ts">
	import Header from './Header.svelte';
	import Board from './Board.svelte';
	import Keyboard from './Keyboard.svelte';
	import { board_size, game_state} from './driver';

	function calculateBoardSize(rows: number, cols: number) {
		let dim = rows > cols ? 'height' : 'width';
		return `aspect-ratio: ${cols}/${rows}; width: ${cols}0%; max-${dim}: 80%;`;
	}

	let style: string = 'width: 80%;';

	$: {
		const { rows, cols } = $board_size;
		style = calculateBoardSize(rows, cols);
	}

	let theme = 'dark';

	function changeTheme(themeName: string) {
		window.document.body.classList.replace(theme, themeName);
		theme = themeName;
	}

	function keydown(event: KeyboardEvent) {
		if (event.metaKey) return;
		document
			.querySelector(`[data-key="${event.key}" i]`)
			?.dispatchEvent(new MouseEvent('click', { cancelable: true }));
	}
    import  Notifications from 'svelte-notifications';
    // https://github.com/keenethics/svelte-notifications
</script>

<svelte:window on:keydown={keydown} />

<Notifications>
<div class="game-outer-container">
	<Header {changeTheme} />
	<div class="game">
		<div class="board-container" {style}>
			<Board />
		</div>
		<div class="keyboard-container">
			<Keyboard />
		</div>
	</div>
</div>
</Notifications>

<svelte:head>
	{#if theme == 'dark'}
		<style>
			:root {
				--bg-color: black;
				--highlight-color: gray;
				--text-color: white;
				--key-bg: silver;
				--guess-correct: seagreen;
				--guess-misplaced: gold;
				--guess-wrong: darkgrey;
				--guess-fg: white;
				background-color: var(--bg-color);
			}
		</style>
	{:else if theme == 'light'}
		<style>
			:root {
				--bg-color: antiquewhite;
				--highlight-color: gray;
				--text-color: black;
				--key-bg: silver;
				--guess-correct: seagreen;
				--guess-misplaced: gold;
				--guess-wrong: darkgrey;
				--guess-fg: white;
				background-color: var(--bg-color);
			}
		</style>
	{:else if theme == 'pink'}
		<style>
			:root {
				--bg-color: lightcoral;
				--highlight-color: seashell;
				--text-color: seashell;
				--key-bg: seashell;
				--guess-correct: palegreen;
				--guess-misplaced: khaki;
				--guess-wrong: lightgrey;
				--guess-fg: dimgrey;
				background-color: var(--bg-color);
			}
		</style>
	{/if}
</svelte:head>

<style>
	:root {
		--keyboard-max-width: 500px;
		--header-height: 40px;
		--header-padding-x: 16px;
	}
	:global(body) {
		overflow-y: unset;
		padding: 0px;
	}

	/* Responsive styles */
	@media (min-width: 415px) {
		:root {
			--header-height: 65px;
		}
	}
	@media (min-width: 1024px) {
		:root {
			--header-padding-x: 24px;
		}
	}

	@media (min-width: 768px) {
		:root {
			--header-padding-x: 20px;
		}
	}

	.game-outer-container {
		position: absolute;
		width: 100%;
		height: 100%;
		top: 0;
		left: 0;
	}

	.game {
		margin: auto;
		position: relative;
		width: 100%;
		height: 100%;
		height: calc(100% - var(--header-height));
		display: flex;
		justify-content: space-between;
		align-items: center;
		flex-direction: column;
		flex-flow: column;
		max-width: var(--keyboard-max-width);
	}

	.board-container {
		margin: auto 10%;
	}

	.keyboard-container {
		margin-bottom: 10%;
		width: 85%;
	}
</style>
