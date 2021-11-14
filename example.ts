import { resolve, relative } from "path"
import { generate } from "./src/cli"
;(async () => {
  const tsconfigPath = resolve(__dirname, "./example/tsconfig.json")

  generate({
    tsconfigPath,
    fileGlobs: ["**/*.ts"],
    basePath: resolve(__dirname, "./example"),
    output: resolve(__dirname, "./example/generated.ts"),
    option: {
      watch: true,
      asserts: true,
    },
  })
})()
