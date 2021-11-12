import { resolve } from "path"
import { createProgram, watchCompiler } from "~/compilerApi"

describe("compilerApi", () => {
  it("createProgram", () => {
    const program = createProgram(
      resolve(__dirname, "../example/tsconfig.json")
    )
    expect(program).toBeDefined()

    console.log(program.getRootFileNames())

    expect(program.getRootFileNames()).toStrictEqual(
      ["./example/types/entity.ts"].map((relativePath) =>
        resolve(__dirname, "..", relativePath)
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
