import { defineConfig } from 'tsup';

defineConfig({
	format: ['esm', 'cjs'],
	shims: true,
	entry: ['src/index.ts'],
	clean: true,
});
