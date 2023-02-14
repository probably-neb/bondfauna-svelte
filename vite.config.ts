import { sveltekit } from '@sveltejs/kit/vite';
import type { UserConfig } from 'vite';
import { defineConfig } from 'vite';
import svg from '@poppanator/sveltekit-svg';
import topLevelAwait from 'vite-plugin-top-level-await';

const config: UserConfig = defineConfig({
	plugins: [
		sveltekit(),
        topLevelAwait(),
		svg(),
	],
	server: {
		fs: {
		}
	}
});

export default config;
