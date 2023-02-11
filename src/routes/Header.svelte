<script lang="ts">
	import { game_state } from './driver';



    }
    let difficulty = 5;
    let difficulty_changed = false;
    const difficulties = [4,5,6,7,8,9];


    $: if (difficulty_changed) {
        // last_difficulty = difficulty;
        console.log("difficulty changed to " + difficulty);
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
		<button on:click={reset} class="icon"
			><img
				class="reset-icon"
				alt="reset"
				src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse1.mm.bing.net%2Fth%3Fid%3DOIP.1BErBCwbAGu1VdPMVnaFDQHaHa%26pid%3DApi&f=1&ipt=3390f753bb1715cc6e3291f12a92e211ec2f5ea05cf3d1f45baa5a383dee3c09&ipo=images"
			/></button
		>
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

	.reset-icon {
		object-fit: contain;
		height: 24px;
		height: 24px;
		-webkit-filter: invert(100%);
		filter: invert(100%);
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
