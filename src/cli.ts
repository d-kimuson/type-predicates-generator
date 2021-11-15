#!/usr/bin/env node
import { Command } from "commander"
import { resolve } from "path"
import { run } from "./generate"

const program = new Command()
program
  .option("-p, --config-path <type>", "tsconfig", "tsconfig.json")
  .option("-f, --file-glob <type>", "file glob", "**/*.ts")
  .option("-o, --output <type>", "output file path", "type-predicates.ts")
  .option("-b, --base-path <type>", "base path", "./")
  .option("-a, --asserts", "also asserts", false)
  .option("-w, --watch", "watch", false)
  .parse(process.argv)

const option = program.opts<{
  configPath: string
  fileGlob: string
  output: string
  basePath: string
  asserts: false
  watch: true
}>()

const cwd = process.cwd()

run({
  tsconfigPath: resolve(cwd, option.configPath),
  fileGlobs: [option.fileGlob],
  output: resolve(cwd, option.output),
  basePath: resolve(cwd, option.basePath),
  option: {
    asserts: option.asserts,
    watch: option.watch,
  },
})
