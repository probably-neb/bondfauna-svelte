<script>
    export let xmlns="http://www.w3.org/2000/svg"; 
    export let color="var(--text-color)";
</script>

<svg {...$$props} style:color>
    <slot />
</svg>

<style>
    svg {
        fill: currentColor;
        stroke: currentColor;
        width: 24px;
        height: 24px;
    }
</style>
