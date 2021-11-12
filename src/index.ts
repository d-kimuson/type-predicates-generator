import { resolve } from "path"
import { Program, TypeChecker } from "typescript"

// オプション(仮)
type GeneratorConfig = {
  inputDirs: string[]
  outDir: string
}

export const generate = ({ inputDirs, outDir }: GeneratorConfig) => {}

generate({
  inputDirs: ["./example/types"].map((relativePath) =>
    resolve(__dirname, "..", relativePath)
  ),
  outDir: resolve(__dirname, "..", "./example/generator"),
})
