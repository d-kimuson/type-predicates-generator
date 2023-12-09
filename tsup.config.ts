import { defineConfig } from "tsup"

export default defineConfig({
  entry: ["src/index.ts", "src/cli.ts"],
  format: ["cjs", "esm"],
  external: ["typescript"],
  tsconfig: "./tsconfig.src.json",
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
})
