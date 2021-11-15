#!/usr/bin/env node
import { Command } from "commander"
import { resolve } from "path"
import { run } from "./generate"

const program = new Command()
program
  .option(
    "-p, --project <type>",
    "Path for project tsconfig.json",
    "tsconfig.json"
  )
  .option("-f, --file-glob <type>", "file glob pattern target types", "**/*.ts")
  .option(
    "-o, --output <type>",
    "file glob pattern that original types are defined for generated.",
    "type-predicates.ts"
  )
  .option("-b, --base-path <type>", "project base path", "./")
  .option("-a, --asserts", "generate assert functions or not", false)
  .option("-w, --watch", "watch or not", false)
  .parse(process.argv)

const option = program.opts<{
  project: string
  fileGlob: string
  output: string
  basePath: string
  asserts: false
  watch: true
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
  },
})
