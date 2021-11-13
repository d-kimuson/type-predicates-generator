import { resolve, relative } from "path"
import { generate } from "./src/cli"
;(async () => {
  const tsconfigPath = resolve(__dirname, "./example/tsconfig.json")

  generate({
    tsconfigPath,
    output: resolve(__dirname, "./example/generated.ts"),
    basePath: resolve(__dirname, "./example"),
    fileGlobs: ["**/{entity,array,special,union}.ts"],
    asserts: true,
  })
})()
