import { resolve } from "path"
import { createProgram, watchCompiler } from "~/compilerApi"

describe("compilerApi", () => {
  it("createProgram", () => {
    const program = createProgram(
      resolve(__dirname, "../example/tsconfig.json")
    )
    expect(program).toBeDefined()

    expect(program.getRootFileNames()).toEqual(
      [
        "array.ts",
        "entity.ts",
        "object.ts",
        "primitive.ts",
        "special.ts",
        "union.ts",
      ].map((relativePath) =>
        resolve(__dirname, "../example/types", relativePath)
      )
    )
  })

  it("watchCompiler", () => {
    const watcher = watchCompiler(
      resolve(__dirname, "../example/tsconfig.json")
    )
    const program = watcher.getProgram().getProgram()
    expect(program).toBeDefined()
    watcher.close()
  })
})
