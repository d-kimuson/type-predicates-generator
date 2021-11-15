import { resolve } from "path"
import {
  sys,
  readConfigFile,
  parseJsonConfigFileContent,
  createProgram as baseCreateProgram,
  createWatchProgram,
  createWatchCompilerHost,
  createEmitAndSemanticDiagnosticsBuilderProgram,
} from "typescript"
import type * as ts from "typescript"

export const createProgram = (tsConfigPath: string): ts.Program => {
  const configFile = readConfigFile(tsConfigPath, sys.readFile)
  if (typeof configFile.error !== "undefined") {
    throw new Error(`Failed to load tsconfig: ${configFile.error}`)
  }

  const { options, fileNames } = parseJsonConfigFileContent(
    configFile.config,
    {
      fileExists: sys.fileExists,
      readFile: sys.readFile,
      readDirectory: sys.readDirectory,
      useCaseSensitiveFileNames: true,
    },
    resolve(tsConfigPath, "..")
  )

  return baseCreateProgram({
    rootNames: fileNames,
    options,
  })
}

// const watcher = watchCompiler(...)
// watcher.getProgram().getProgram() => ts.Program
// watch しなくて良いときは createProgram から
export function watchCompiler(
  tsConfigPath: string,
  watchFiles: string[] = [],
  onFileChanged: ts.FileWatcherCallback,
  watchOption?: ts.WatchOptions,
  reportDiagnostic?: ts.DiagnosticReporter,
  reportWatchStatus?: ts.WatchStatusReporter
): ts.WatchOfConfigFile<ts.EmitAndSemanticDiagnosticsBuilderProgram> {
  const createProgram = createEmitAndSemanticDiagnosticsBuilderProgram
  const host = createWatchCompilerHost(
    tsConfigPath,
    {
      noEmit: true,
    },
    sys,
    createProgram,
    reportDiagnostic,
    reportWatchStatus,
    watchOption
  )
  watchFiles.forEach((file) => {
    host.watchFile(file, onFileChanged)
  })
  return createWatchProgram(host)
}
