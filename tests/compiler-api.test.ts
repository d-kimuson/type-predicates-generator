import { resolve } from "path"
import { createProgram, watchCompiler } from "~/compiler-api/program"

describe("compilerApi", () => {
  it("createProgram", () => {
    const program = createProgram(
      resolve(__dirname, "../example/tsconfig.json")
    )
    expect(program).toBeDefined()
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
