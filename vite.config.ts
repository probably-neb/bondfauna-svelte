import { sveltekit } from '@sveltejs/kit/vite';
import type { UserConfig } from 'vite';
import { defineConfig } from 'vite';
import wasm from 'vite-plugin-wasm'
import topLevelAwait from 'vite-plugin-top-level-await'

const config: UserConfig = defineConfig({
	plugins: [sveltekit(),wasm(),topLevelAwait()],
    server: {
        fs: {
            allow: [
                './roget/pkg/'
            ]
        }
    }
});

export default config;
