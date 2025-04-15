import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import path from 'path';
import { fileURLToPath } from 'url';

const filename = fileURLToPath(import.meta.url);
const projectRootDir = path.dirname(filename);

// https://vitejs.dev/config/
export default defineConfig({
	// base: './',
	resolve: {
		alias: {
			'@': path.resolve(__dirname, './src'),
		},
	},
	plugins: [svelte({ configFile: './config/svelte.config.js' })],
	build: {
		outDir: 'dist',
		assetsDir: 'assets',
		emptyOutDir: true,
	},
});
