import adapter from '@sveltejs/adapter-static';
import { sveltekit } from '@sveltejs/kit/vite';
import { mdsvex } from 'mdsvex';
import { defineConfig } from 'vite';
import { fileURLToPath } from 'node:url';

// Build scaffolding added around the exported kb so its pages can be rendered as the desk sees them.
export default defineConfig({
  plugins: [
    sveltekit({
      extensions: ['.svelte', '.svx'],
      preprocess: [mdsvex({ extensions: ['.svx'], layout: { runbook: fileURLToPath(new URL('./src/lib/layouts/runbook.svelte', import.meta.url)) } })],
      adapter: adapter(),
      alias: { '#lib': 'src/lib', '#lib/*': 'src/lib/*' },
      prerender: { entries: ['*'], handleHttpError: 'warn' },
      inlineStyleThreshold: Infinity,
    }),
  ],
});
