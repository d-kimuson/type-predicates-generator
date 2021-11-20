import { resolve } from "path"
import { run } from "./src/generate"
;(async () => {
  const tsconfigPath = resolve(__dirname, "./example/tsconfig.json")

  run({
    tsconfigPath,
    fileGlobs: ["**/types/**/*.ts"],
    basePath: resolve(__dirname, "./example"),
    output: resolve(__dirname, "./example/type-predicates.ts"),
    option: {
      watch: false,
      asserts: true,
      strictArrayCheck: true,
    },
  })
})()
