import { uniq } from "ramda"
import type * as to from "./typeObject"

const primitiveTypePredicateNameMap = {
  string: "isString",
  number: "isNumber",
  bigint: "isBigint",
  boolean: "isBoolean",
}

const specialTypePredicateNameMap = {
  null: "isNull",
  undefined: "isUndefined",
  any: "isAny",
  unknown: "isUnknown",
  never: "isNever",
  void: "isVoid",
}

const primitiveTypePredicateMap = {
  string:
    "const isString = (value: unknown): value is string => typeof value === 'string';",
  number:
    "const isNumber = (value: unknown): value is number => typeof value === 'number';",
  bigint:
    "const isBigint = (value: unknown): value is bigint => typeof value === 'bigint';",
  boolean:
    "const isBoolean = (value: unknown): value is boolean => typeof value === 'boolean';",
}

const specialTypePredicateMap = {
  null: "const isNull = (value: unknown): value is null => value === null;",
  undefined:
    "const isUndefined = (value: unknown): value is undefined => typeof value === 'undefined';",
  any: "const isAny = () => true;",
  unknown: "const isUnknown = () => true;",
  never: "const isNever = () => false;",
  void: "const isVoid = () => false;",
}

const utilTypePredicateMap = {
  object: `const isObject = (value: unknown): value is Record<string, unknown> =>
      typeof value === 'object' && value !== null && !Array.isArray(value);`,
}

function isPossibleUseTypeName(
  value: to.TypeObject
): value is to.ArrayTO | to.ObjectTO | to.UnionTO {
  return ["ArrayTO", "ObjectTO", "UnionTO"].includes(value.__type)
}

export function generateTypePredicates(
  files: {
    importPath: string
    types: {
      typeName: string
      type: to.TypeObject
    }[]
  }[],
  asserts = false
): string {
  const usedPrimitives: to.PrimitiveTO["kind"][] = []
  const usedSpecials: to.SpecialTO["kind"][] = []
  const usedUtils: (keyof typeof utilTypePredicateMap)[] = []
  const typeNames = files.flatMap(({ types }) =>
    types.map(({ typeName }) => typeName)
  )

  const generateCheckFn = ({
    type,
    typeName,
    parentArgCount,
  }: {
    type: to.TypeObject
    typeName?: string
    parentArgCount: number
  }): string => {
    const argCount = parentArgCount + 1
    const argName = () => `arg_${argCount}`
    const isToplevel = typeof typeName === "string"

    if (
      !isToplevel &&
      isPossibleUseTypeName(type) &&
      typeNames.includes(type.typeName)
    ) {
      return `is${type.typeName}`
    }

    if (type.__type === "PrimitiveTO") {
      usedPrimitives.push(type.kind)
      return primitiveTypePredicateNameMap[type.kind]
    } else if (type.__type === "SpecialTO") {
      usedSpecials.push(type.kind)
      return specialTypePredicateNameMap[type.kind]
    } else if (type.__type === "ArrayTO") {
      return `
      (${argName()}: unknown)${
        typeName ? `: ${argName()} is ${typeName}` : ""
      } =>
        Array.isArray(${argName()}) &&
        ${argName()}.reduce((s: boolean, t: unknown) => s && (${generateCheckFn(
        {
          type: type.child,
          parentArgCount: argCount,
        }
      )})(t) , true)`
    } else if (type.__type === "UnionTO") {
      return `
      (${argName()}: unknown)${
        typeName ? `: ${argName()} is ${typeName}` : ""
      } =>
        ${type.unions
          .map(
            (unionType) =>
              `(${generateCheckFn({
                type: unionType,
                parentArgCount: argCount,
              })})(${argName()})`
          )
          .join(" || ")}`
    } else if (type.__type === "ObjectTO") {
      usedUtils.push("object")
      return `
      (${argName()}: unknown)${
        typeName ? `: ${argName()} is ${typeName}` : ""
      } =>
        isObject(${argName()}) &&
        ${type
          .getProps()
          .map(
            (prop) =>
              `('${prop.propName}' in ${argName()} && (${generateCheckFn({
                type: prop.type,
                parentArgCount: argCount,
              })})(${argName()}['${prop.propName}']))`
          )
          .join(" && ")}`
    }

    console.warn(`${typeName} will be skipped because not supported.`)
    return `/* WARN: Not Supported Type */ () => {
      console.warn('check was skipped bacause ${typeName} is not supported type.');
      return true;
    }`
  }

  const checkFns = files
    .flatMap((file) => file.types)
    .map(
      ({ type, typeName }) => `
    export const is${typeName} = ${generateCheckFn({
        type,
        typeName,
        parentArgCount: -1,
      })};
    ${
      asserts
        ? `
    export function assertIs${typeName}(value: unknown): asserts value is ${typeName} {
      if (!is${typeName}(value)) throw TypeError(\`value must be ${typeName} but received \${value}\`)
    }
    `
        : ""
    }`
    )

  const corePredicates = uniq(
    [
      usedPrimitives.map((kind) => primitiveTypePredicateMap[kind]),
      usedSpecials.map((kind) => specialTypePredicateMap[kind]),
      usedUtils.map((name) => utilTypePredicateMap[name]),
    ].flat()
  )

  return `
    ${files
      .map(
        ({ importPath, types }) =>
          `import type { ${types
            .map(({ typeName }) => typeName)
            .join(", ")} } from '${importPath}'`
      )
      .join(";\n")}
    ${corePredicates.join("\n")}

    ${checkFns.map((checkFn) => checkFn).join("\n")}
  `
}
