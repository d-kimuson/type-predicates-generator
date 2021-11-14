import { resolve, relative } from "path"
import { writeFileSync } from "fs"
import * as to from "~/type-object"
import { createProgram } from "~/compiler-api"
import { CompilerApiHandler } from "~/compiler-api-handler"
import { generateTypePredicates } from "~/type-predicates"
import { isNg } from "./utils"
import * as glob from "glob"

export async function generate({
  tsconfigPath,
  output,
  basePath,
  fileGlobs,
  asserts,
}: {
  tsconfigPath: string
  output: string
  basePath: string
  fileGlobs: string[]
  asserts: boolean
}) {
  const program = createProgram(tsconfigPath)
  const handler = new CompilerApiHandler(program)

  const files = fileGlobs
    .flatMap((fileGlob) =>
      glob.sync(fileGlob, {
        sync: true,
        cwd: basePath,
      })
    )
    .map((filePath) => resolve(basePath, filePath))

  const types = files.map((filePath) => {
    const result = handler.extractTypes(filePath)
    const importPath =
      "./" + relative(resolve(output, ".."), filePath).replace(".ts", "")

    if (isNg(result)) {
      throw Error("Fail to extract files")
    }

    return {
      importPath,
      types: result.ok.filter(
        (
          type
        ): type is {
          typeName: string
          type: to.TypeObject
        } => typeof type.typeName === "string"
      ),
    }
  })

  const generatedCode = generateTypePredicates(types, asserts)
  writeFileSync(output, generatedCode)
}
