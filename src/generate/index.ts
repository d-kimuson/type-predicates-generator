import type * as ts from "typescript"
import * as glob from "glob"
import * as to from "~/type-object"
import { writeFileSync } from "fs"
import { resolve, relative } from "path"
import { createProgram, watchCompiler } from "~/compiler-api/program"
import { CompilerApiHandler } from "~/compiler-api/compiler-api-handler"
import { generateTypePredicates } from "~/generate/generate-type-predicates"
import { isNg } from "~/utils"

type GenerateOption = {
  asserts: boolean
  watch: boolean
}

export async function run({
  tsconfigPath,
  fileGlobs,
  output,
  basePath,
  option,
}: {
  tsconfigPath: string
  fileGlobs: string[]
  output: string
  basePath: string
  option: GenerateOption
}) {
  const files = fileGlobs
    .flatMap((fileGlob) =>
      glob.sync(fileGlob, {
        sync: true,
        cwd: basePath,
      })
    )
    .map((filePath) => resolve(basePath, filePath))

  let program: ts.Program
  if (option.watch) {
    let onUpdate: (() => void) | undefined = undefined
    const watcher = watchCompiler(
      tsconfigPath,
      () => {},
      ({ code }) => {
        if (onUpdate && code === 6194 /* after compiled */) {
          onUpdate()
        }
      },
      {
        excludeFiles: [output],
      }
    )

    onUpdate = () => {
      const updatedProgram = watcher.getProgram().getProgram()
      generateAndWriteCodes(updatedProgram, files, output, option)

      console.log("successfully generated")
    }
    program = watcher.getProgram().getProgram()

    console.log("start watching ...")
    console.log(`target file: ${output}`)
  } else {
    program = createProgram(tsconfigPath)
  }

  generateAndWriteCodes(program, files, output, option)
}

const generateAndWriteCodes = (
  program: ts.Program,
  files: string[],
  output: string,
  { asserts }: GenerateOption
) => {
  const handler = new CompilerApiHandler(program)

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
