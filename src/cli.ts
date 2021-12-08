#!/usr/bin/env node
import { resolve } from "path"
import { Command } from "commander"
import type { ArrayCheckOption } from "./generate"
import { run } from "./generate"

const program = new Command()
program
  .option(
    "-p, --project <type>",
    "Path for project tsconfig.json",
    "tsconfig.json"
  )
  .option("-f, --file-glob <type>", "file glob pattern target types", "**/*.ts")
  .option("-o, --output <type>", "output file path", "type-predicates.ts")
  .option("-b, --base-path <type>", "project base path", "./")
  .option("-a, --asserts", "generate assert functions or not", false)
  .option("-w, --watch", "watch or not", false)
  .option(
    "--default-array-check-option",
    "how to check child element type. 'all' or 'first'",
    "all"
  )
  .option("-c, --comment", "generate JSDoc comments or not", false)
  .parse(process.argv)

const option = program.opts<{
  project: string
  fileGlob: string
  output: string
  basePath: string
  asserts: boolean
  watch: boolean
  defaultArrayCheckOption: ArrayCheckOption
  comment: boolean
}>()

const cwd = process.cwd()

run({
  tsconfigPath: resolve(cwd, option.project),
  fileGlobs: [option.fileGlob],
  output: resolve(cwd, option.output),
  basePath: resolve(cwd, option.basePath),
  option: {
    asserts: option.asserts,
    watch: option.watch,
    defaultArrayCheckOption: option.defaultArrayCheckOption,
    comment: option.comment,
  },
})
