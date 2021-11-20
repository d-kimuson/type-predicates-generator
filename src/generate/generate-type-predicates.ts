import * as dedent from "dedent"
import { uniq } from "ramda"
import type * as to from "../type-object"

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
  Date: "isDate",
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
  any: "const isAny = (value: unknown): value is any => true;",
  unknown: "const isUnknown = (value: unknown): value is unknown => true;",
  never: "const isNever = (value: unknown): value is never => false;",
  void: "const isVoid = (value: unknown): value is void => false;",
  Date: `const isDate = (value: unknown): value is Date =>
      value instanceof Date || Object.prototype.toString.call(value) === '[Object Date]'`,
}

const utilTypePredicateMap = {
  object: `const isObject = (value: unknown): value is Record<string, unknown> =>
      typeof value === 'object' && value !== null && !Array.isArray(value);`,
  array: `const isArray = <T>(childCheckFn: (value: unknown) => value is T) =>
      (array: unknown): array is T[] =>
        Array.isArray(array) && (
          typeof array[0] === "undefined" ||
          childCheckFn(array[0])
        );`,
  strictArray: `const isArray = <T>(childCheckFn: (value: unknown) => value is T) =>
      (array: unknown): array is T[] =>
        Array.isArray(array) &&
        array.reduce((s: boolean, t: unknown) => s && childCheckFn(t), true);`,
}

function isPossibleUseTypeName(
  value: to.TypeObject
): value is to.ArrayTO | to.ObjectTO | to.UnionTO {
  return ["ArrayTO", "ObjectTO", "UnionTO"].includes(value.__type)
}

function generateDeclare(argName: string, typeName?: string) {
  return `(${argName}: unknown): ${
    typeName ? `${argName} is ${typeName}` : "boolean"
  } => `
}

export function isMaybeUndefined(type: to.TypeObject): boolean {
  return (
    (type.__type === "SpecialTO" && type.kind === "undefined") ||
    (type.__type === "UnionTO" &&
      typeof type.unions.find(
        (union) => union.__type === "SpecialTO" && union.kind === "undefined"
      ) !== "undefined")
  )
}

export function generateTypePredicates(
  files: {
    importPath: string
    types: {
      typeName: string
      type: to.TypeObject
    }[]
  }[],
  asserts = false,
  strictArrayCheck = false
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
    } else if (type.__type === "LiteralTO") {
      return `${generateDeclare(argName(), typeName)}${argName()} === ${
        typeof type.value === "string" ? '"' + type.value + '"' : type.value
      }`
    } else if (type.__type === "UnionTO") {
      return `${generateDeclare(argName(), typeName)}${type.unions
        .map(
          (unionType) =>
            `(${generateCheckFn({
              type: unionType,
              parentArgCount: argCount,
            })})(${argName()})`
        )
        .join(" || ")}`
    } else if (type.__type === "ArrayTO") {
      usedUtils.push(strictArrayCheck ? "strictArray" : "array")
      const checkChildFn = generateCheckFn({
        type: type.child,
        parentArgCount: argCount,
      })

      return `${generateDeclare(
        argName(),
        typeName
      )}isArray(${checkChildFn})(${argName()})`
    } else if (type.__type === "ObjectTO") {
      usedUtils.push("object")
      return `${generateDeclare(argName(), typeName)}isObject(${argName()}) &&
      ${type
        .getProps()
        .map(
          ({ propName, type }) =>
            `(${
              isMaybeUndefined(type) ? `` : `'${propName}' in ${argName()} && `
            }(${generateCheckFn({
              type,
              parentArgCount: argCount,
            })})(${argName()}['${propName}']))`
        )
        .join(" && ")}`
    } else if (type.__type === "TypeParameterTO") {
      return `(_) => true`
    } else if (type.__type === "TupleTO") {
      return `${generateDeclare(
        argName(),
        typeName
      )}Array.isArray(${argName()}) && (${type.items
        .map(
          (item, index) =>
            `(${generateCheckFn({
              type: item,
              parentArgCount: argCount,
            })})(${argName()}[${index}])`
        )
        .join(" && ")})`
    }

    console.warn(
      `An unsupported or unknown type was detected. The generated function will skip the check (TypeName: ${
        typeName ?? "unknown"
      })`
    )
    return `/* WARN: Not Supported Type */ (value: unknown)${
      typeof typeName === "string" ? `:value is ${typeName}` : ""
    } => {
      console.warn(\`check was skipped bacause \${value} is not supported type.\`);
      return true;
    }`
  }

  const generatedTypeNames: string[] = []
  const skipImports: {
    typeName: string
    importPath: string
  }[] = []

  const checkFns = files
    .flatMap((file) =>
      file.types.map((type) => ({ ...type, importPath: file.importPath }))
    )
    .map(({ type, typeName, importPath }) => {
      if (
        // Do not generate predicates for top-level unknown type
        generatedTypeNames.includes(typeName) ||
        // Prevent re-generate predicates
        type.__type === "UnknownTO"
      ) {
        skipImports.push({
          typeName,
          importPath,
        })
        return ``
      }

      generatedTypeNames.push(typeName)

      return `export const is${typeName} = ${generateCheckFn({
        type,
        typeName,
        parentArgCount: -1,
      })};
    ${
      asserts
        ? `export function assertIs${typeName}(value: unknown): asserts value is ${typeName} {
      if (!is${typeName}(value)) throw new TypeError(\`value must be ${typeName} but received \${value}\`)
    };`
        : ""
    }`
    })

  const corePredicates = uniq(
    [
      usedPrimitives.map((kind) => primitiveTypePredicateMap[kind]),
      usedSpecials.map((kind) => specialTypePredicateMap[kind]),
      usedUtils.map((name) => utilTypePredicateMap[name]),
    ].flat()
  )

  return dedent(`
    ${files
      .filter(
        ({ types, importPath }) =>
          types.length -
            skipImports.filter(
              ({ importPath: skipImportPath }) => skipImportPath === importPath
            ).length !==
          0
      )
      .map(
        ({ importPath, types }) =>
          `import type { ${types
            .filter(
              ({ typeName }) =>
                !skipImports.find(
                  ({ typeName: skipTypeName, importPath: skipImportPath }) =>
                    skipTypeName === typeName && skipImportPath === importPath
                )
            )
            .map(({ typeName }) => typeName)
            .join(", ")} } from '${importPath}'`
      )
      .join(";\n")};

    ${corePredicates.join("\n")}

    ${checkFns.map((checkFn) => checkFn).join("\n")}
  `)
}
