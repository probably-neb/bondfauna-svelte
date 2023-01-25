<script lang="ts">
	export let col: number, row: number;
</script>

<div class="tile" data-guess="empty" ></div>

<style lang="scss">
	@import './reactive_colors.scss';
	.tile {
		width: 100%;
		display: inline-flex;
		justify-content: center;
		align-items: center;
		font-size: 2rem;
		line-height: 1;
		font-weight: bold;
		vertical-align: middle;
		box-sizing: border-box;
		text-transform: uppercase;
		-webkit-user-select: none;
		-moz-user-select: none;
		user-select: none;
		color: var(--text-color-default);
	}

	.tile::before {
		content: '';
		display: inline-block;
		padding-bottom: 100%;
	}
</style>
