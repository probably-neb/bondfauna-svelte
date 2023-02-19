<script>
	import { dev } from '$app/environment';
	import { onMount } from 'svelte';

	onMount(async () => {
		if (!dev) {
			const { inject } = await import('@vercel/analytics');

			inject({ mode: 'production' });
		}
	});
</script>

<slot />
