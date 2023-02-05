import { pathsToModuleNameMapper } from "ts-jest"
import { readConfigFile, parseJsonConfigFileContent, sys } from "typescript"

const configFile = readConfigFile("./tsconfig.src.json", sys.readFile)
if (typeof configFile.error !== "undefined") {
  throw new Error(`Failed to load tsconfig: ${configFile.error}`)
}

const { options } = parseJsonConfigFileContent(
  configFile.config,
  {
    fileExists: sys.fileExists,
    readFile: sys.readFile,
    readDirectory: sys.readDirectory,
    useCaseSensitiveFileNames: true,
  },
  __dirname
)

module.exports = {
  roots: ["<rootDir>"],
  testMatch: ["**/?(*.)+(spec|test).+(ts|tsx)"],
  testPathIgnorePatterns: ["<rootDir>/example/"],
  globals: {
    "ts-jest": {
      tsconfig: "tsconfig.test.json",
    },
  },
  transform: {
    "^.+\\.(t|j)s$": "@swc/jest",
  },
  moduleNameMapper: pathsToModuleNameMapper(options.paths ?? {}, {
    prefix: "<rootDir>",
  }),
}
