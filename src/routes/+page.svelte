<script lang="ts">
    import App from "./App.svelte"
</script>

<App />

<style>
	:global(html) {
		height: 100%;
	}
	:global(body) {
		background-color: var(--bg-default);
		overflow-y: unset;
		padding: 0px;
	}
	:root {
		--bg-default: black;
		--highlight-color-default: gray;
		--text-color-default: white;
		--key-bg-default: silver;
		--guess-correct: seagreen;
		--guess-misplaced: gold;
		--guess-wrong: darkgrey;
		--guess-fg: white;
		--game-max-width: 500px;
		--header-height: 40px;
		--header-padding-x: 16px;
		font-size: 16px;
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
</style>
