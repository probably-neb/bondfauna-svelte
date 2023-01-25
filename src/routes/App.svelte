<script lang="ts">
	import Header from './Header.svelte';
	import Board from './Board.svelte';
    import Keyboard from './Keyboard.svelte';

    function onclick(code: String):void {
        console.log("hit: ",code);
    }
</script>

<div class="game-outer-container">
	<Header />
	<div class="game-container" style="height: 90%;">
		<div class="game">
			<Board />
            <Keyboard {onclick}/>
		</div>
	</div>
</div>

<style>
	.game-outer-container {
		position: absolute;
		width: 100%;
		height: 100%;
		top: 0;
		left: 0;
	}
	.game-container {
		position: relative;
	}
	.game {
		width: 100%;
		max-width: var(--game-max-width);
		margin: 0 auto;
		height: calc(100% - var(--header-height));
		display: flex;
		flex-direction: column;
		flex-flow: column;
	}
</style>
