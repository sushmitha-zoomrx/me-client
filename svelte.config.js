import { defineConfig } from 'vite';
import sveltePreprocess from 'svelte-preprocess';

export default defineConfig({
	preprocess: sveltePreprocess({
		scss: {
			// We can use a path relative to the root because
			// svelte-preprocess automatically adds it to `includePaths`
			// if none is defined.
			// prependData: `@import 'src/lib/styles/_variables.scss';`,
		},
	}),
});
