import { resolve } from "path"
import { describe, it, expect } from "vitest"
import { createProgram, watchCompiler } from "~/compiler-api/program"

describe("compilerApi", () => {
  it("createProgram", () => {
    const program = createProgram(
      resolve(__dirname, "../../example/tsconfig.json")
    )
    expect(program).toBeDefined()
  })

  it("watchCompiler", () => {
    const watcher = watchCompiler(
      resolve(__dirname, "../../example/tsconfig.json"),
      [],
      () => {
        // nothing
      }
    )
    const program = watcher.getProgram().getProgram()
    expect(program).toBeDefined()
    watcher.close()
  })
})
