import { defineConfig } from "tsup";

export default defineConfig({
	clean: true,
	entry: ["src/index.ts"],
	splitting: false,
	sourcemap: true,
	format: "cjs",
	shims: true,
	platform: "node",
});
