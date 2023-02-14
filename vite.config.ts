import { sveltekit } from '@sveltejs/kit/vite';
import type { UserConfig } from 'vite';
import { defineConfig } from 'vite';
import svg from '@poppanator/sveltekit-svg';

const config: UserConfig = defineConfig({
	plugins: [
		sveltekit(),
		svg(),
	],
	server: {
		fs: {
		}
	}
});

export default config;
