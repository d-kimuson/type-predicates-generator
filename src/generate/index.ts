import { writeFileSync } from "fs"
import { resolve, relative } from "path"
import * as glob from "glob"
import { WatchFileKind } from "typescript"
import type * as ts from "typescript"
import { CompilerApiHandler } from "~/compiler-api/compiler-api-handler"
import { createProgram, watchCompiler } from "~/compiler-api/program"
import { generateTypePredicates } from "~/generate/generate-type-predicates"
import type * as to from "~/type-object"
import { isNg } from "~/utils"

export type ArrayCheckOption = "all" | "first"

type GenerateOption = {
  asserts: boolean
  watch: boolean
  defaultArrayCheckOption: ArrayCheckOption
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
        ignore: ["**/node_modules/**/*.ts", output],
      })
    )
    .map((filePath) => resolve(basePath, filePath))
    .filter((filePath) => filePath !== output)

  let program: ts.Program
  if (option.watch) {
    let onUpdate: (() => void) | undefined = undefined
    const watcher = watchCompiler(
      tsconfigPath,
      files,
      () => {
        if (onUpdate) {
          onUpdate()
        }
      },
      {
        watchFile: WatchFileKind.UseFsEvents,
        excludeFiles: [output],
      },
      // デフォルトのメソッドを打ち消すため
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      () => {},
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      () => {}
    )

    onUpdate = () => {
      const updatedProgram = watcher.getProgram().getProgram()
      generateAndWriteCodes(updatedProgram, files, output, option)

      console.log("File changes are detected, and successfully regenerated.")
    }
    program = watcher.getProgram().getProgram()

    console.log("start watching ...")
  } else {
    program = createProgram(tsconfigPath)
  }

  generateAndWriteCodes(program, files, output, option)
  console.log(`successfully generated: ${output}`)
}

const generateAndWriteCodes = (
  program: ts.Program,
  files: string[],
  output: string,
  { asserts, defaultArrayCheckOption }: GenerateOption
) => {
  const handler = new CompilerApiHandler(program)

  const types = files.map((filePath) => {
    const result = handler.extractTypes(filePath)
    const importPath =
      "./" +
      relative(resolve(output, ".."), filePath)
        .replace(".d.ts", "")
        .replace(".ts", "")

    if (isNg(result)) {
      throw Error(`Fail to extract types from ${filePath}`)
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

  const generatedCode = generateTypePredicates(
    types,
    asserts,
    defaultArrayCheckOption
  )
  writeFileSync(output, generatedCode)
}
