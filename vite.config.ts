import { sveltekit } from '@sveltejs/kit/vite';
import type { UserConfig } from 'vite';
import { defineConfig } from 'vite';
import wasm from 'vite-plugin-wasm';
// import { ViteRsw } from 'vite-plugin-rsw'
import topLevelAwait from 'vite-plugin-top-level-await';
import svg from '@poppanator/sveltekit-svg';

const config: UserConfig = defineConfig({
	plugins: [
        sveltekit(),
        svg(),
        wasm(),
        topLevelAwait()
        // ,ViteRsw()
    ],
    server: {
        fs: {
            // allow: [
            //     './roget/pkg/',
            //     './wasm-wordle/pkg/'
            // ]
        }
    }
});

export default config;
