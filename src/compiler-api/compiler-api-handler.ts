import * as ts from "typescript"
import { forEachChild, unescapeLeadingUnderscores } from "typescript"
import type * as to from "../type-object"
import type { Result } from "~/utils"
import { isNg } from "~/utils"
import { ok, ng, switchExpression, isOk } from "~/utils"
import { primitive, special, skip } from "../type-object"

export class CompilerApiHandler {
  #program: ts.Program
  #typeChecker: ts.TypeChecker

  constructor(program: ts.Program) {
    this.#program = program
    this.#typeChecker = this.#program.getTypeChecker()
  }

  public extractTypes(filePath: string): Result<
    { typeName: string | undefined; type: to.TypeObject }[],
    | { reason: "fileNotFound" }
    | {
        reason: "exportError"
        meta:
          | "fileNotFound"
          | "resolvedModulesNotFound"
          | "moduleNotFound"
          | "moduleFileNotFound"
          | "notNamedExport"
          | "unknown"
      }
  > {
    const sourceFile = this.#program.getSourceFile(filePath)

    if (!sourceFile) {
      return ng({
        reason: "fileNotFound",
      })
    }

    const nodes = this.#extractNodes(sourceFile)
      .filter(
        (
          node
        ): node is
          | ts.TypeAliasDeclaration
          | ts.InterfaceDeclaration
          | ts.EnumDeclaration
          | ts.ExportDeclaration =>
          ts.isExportDeclaration(node) ||
          ts.isEnumDeclaration(node) ||
          ((ts.isInterfaceDeclaration(node) ||
            ts.isTypeAliasDeclaration(node)) &&
            // @ts-expect-error exclude not exported type def
            typeof node?.localSymbol !== "undefined")
      )
      .filter((node) =>
        this.#isTypeParametersResolved(
          this.#typeChecker.getTypeAtLocation(node)
        )
      )

    return ok(
      nodes
        .flatMap((node) => {
          // export {} from 'path'
          if (ts.isExportDeclaration(node)) {
            const nodes = this.#extractTypesFromExportDeclaration(node)
            if (isOk(nodes)) {
              return nodes.ok
            } else {
              return ng({
                reason: "exportError" as const,
                meta: nodes.ng.reason,
              })
            }
          }

          // export declaration
          return {
            typeName:
              typeof node?.symbol?.escapedName !== "undefined"
                ? String(node?.symbol?.escapedName)
                : undefined,
            type: this.#convertType(this.#typeChecker.getTypeAtLocation(node)),
          }
        })
        .filter(
          (
            result
          ): result is {
            typeName: string | undefined
            type: to.TypeObject
          } => {
            if ("__type" in result && isNg(result)) {
              console.log(`Skip reason: ${result.ng.meta}`)
              return false
            }

            return true
          }
        )
    )
  }

  // Only support named-export
  #extractTypesFromExportDeclaration(declare: ts.ExportDeclaration): Result<
    { typeName: string | undefined; type: to.TypeObject }[],
    {
      reason:
        | "fileNotFound"
        | "resolvedModulesNotFound"
        | "moduleNotFound"
        | "moduleFileNotFound"
        | "notNamedExport"
        | "unknown"
    }
  > {
    const path = declare.moduleSpecifier?.getText()
    if (!path)
      return ng({
        reason: "fileNotFound",
      })

    const sourceFile = declare.getSourceFile()
    const moduleMap =
      // @ts-expect-error: type def wrong
      sourceFile.resolvedModules as
        | ts.UnderscoreEscapedMap<ts.ResolvedModule>
        | undefined

    if (!moduleMap)
      return ng({
        reason: "resolvedModulesNotFound",
      })

    const module = moduleMap.get(
      ts.escapeLeadingUnderscores(path.replace(/'/g, "").replace(/"/g, ""))
    )

    if (!module)
      return ng({
        reason: "moduleNotFound",
      })

    const types = this.extractTypes(module.resolvedFileName)
    if (isNg(types)) return ng({ reason: "moduleFileNotFound" })

    const clause = declare.exportClause
    if (!clause)
      return ng({
        reason: "unknown",
      })

    if (ts.isNamedExports(clause)) {
      return ok(
        clause.elements
          .map(({ symbol }) => symbol?.getEscapedName())
          .filter((str): str is ts.__String => typeof str !== "undefined")
          .map((str) => ts.unescapeLeadingUnderscores(str))
          .map(
            (key) =>
              types.ok.find(({ typeName }) => typeName === key) ?? {
                typeName: key,
                type: skip(),
              }
          )
      )
    }

    return ng({
      reason: "notNamedExport",
    })
  }

  #extractNodes(sourceFile: ts.SourceFile): ts.Node[] {
    const nodes: ts.Node[] = []
    forEachChild(sourceFile, (node) => {
      nodes.push(node)
    })

    return nodes
  }

  #createObjectType(tsType: ts.Type): to.ObjectTO {
    return {
      __type: "ObjectTO",
      tsType,
      typeName: this.#typeToString(tsType),
      getProps: () =>
        this.#typeChecker
          .getPropertiesOfType(tsType)
          .map(
            (
              symbol
            ): {
              propName: string
              type: to.TypeObject
            } => {
              const declare = (symbol.declarations ?? [])[0]
              const type = declare
                ? this.#typeChecker.getTypeOfSymbolAtLocation(symbol, declare)
                : undefined

              return {
                propName: String(symbol.escapedName),
                type: type
                  ? this.#isCallable(type)
                    ? skip()
                    : this.#convertType(type)
                  : {
                      __type: "UnknownTO",
                      kind: "prop",
                    },
              }
            }
          )
          .filter((typeObject) => typeObject.type.__type !== "SkipTO"),
    }
  }

  #extractArrayTFromTypeNode(typeNode: ts.ArrayTypeNode): to.TypeObject {
    return this.#convertType(
      this.#typeChecker.getTypeAtLocation(typeNode.elementType)
    )
  }

  #extractArrayT(
    type: ts.Type
  ): Result<
    to.TypeObject,
    { reason: "node_not_defined" | "not_array_type_node" | "cannot_resolve" }
  > {
    const maybeArrayT = (type.resolvedTypeArguments ?? [])[0]
    if (
      type.symbol.getEscapedName() === "Array" &&
      typeof maybeArrayT !== "undefined"
    ) {
      return ok(this.#convertType(maybeArrayT))
    }

    const maybeNode = type?.node
    if (!maybeNode) {
      return ng({
        reason: "node_not_defined",
      })
    }

    // Array<T> で定義されているとき
    if (ts.isTypeReferenceNode(maybeNode)) {
      const [typeArg1] = this.#extractTypeArgumentsFromTypeRefNode(maybeNode)

      return typeof typeArg1 !== "undefined"
        ? ok(typeArg1)
        : ng({
            reason: "cannot_resolve",
          })
    }

    if (!ts.isArrayTypeNode(maybeNode)) {
      return ng({
        reason: "not_array_type_node",
      })
    }

    return ok(this.#extractArrayTFromTypeNode(maybeNode))
  }

  #extractTypeArguments(
    type: ts.Type
  ): Result<
    to.TypeObject[],
    { reason: "node_not_found" | "not_type_ref_node" }
  > {
    const maybeTypeRefNode = (type.aliasSymbol?.declarations ?? [])[0]?.type

    if (!maybeTypeRefNode) {
      return ng({
        reason: "node_not_found",
      })
    }

    if (!ts.isTypeReferenceNode(maybeTypeRefNode)) {
      return ng({
        reason: "not_type_ref_node",
      })
    }

    return ok(this.#extractTypeArgumentsFromTypeRefNode(maybeTypeRefNode))
  }

  #extractTypeArgumentsFromTypeRefNode(
    node: ts.TypeReferenceNode
  ): to.TypeObject[] {
    return Array.from(node.typeArguments ?? []).map((arg) =>
      this.#convertType(this.#typeChecker.getTypeFromTypeNode(arg))
    )
  }

  #hasUnresolvedTypeParameter(type: to.TypeObject): boolean {
    if (!("typeName" in type)) {
      return type.__type === "TypeParameterTO"
    }

    const deps: to.TypeObject[] =
      type.__type === "ObjectTO"
        ? type.getProps().map((prop) => prop.type)
        : type.__type === "ArrayTO"
        ? [type.child]
        : type.__type === "UnionTO"
        ? type.unions
        : []

    return deps.reduce(
      (s: boolean, t: to.TypeObject) =>
        s ||
        t.__type === "TypeParameterTO" ||
        ("typeName" in t &&
          t.typeName !== type.typeName &&
          this.#hasUnresolvedTypeParameter(t)),
      false
    )
  }

  #convertType(type: ts.Type): to.TypeObject {
    return switchExpression({
      type,
      typeNode: type.node,
      typeText: this.#typeToString(type),
    })
      .case<to.UnionTO>(
        ({ type }) => type.isUnion(),
        ({ typeText }) => ({
          __type: "UnionTO",
          typeName: typeText,
          unions: (type?.types ?? []).map((type) => this.#convertType(type)),
        })
      )
      .case<to.TypeParameterTO>(
        ({ type }) => type.isTypeParameter(),
        ({ typeText }) => ({
          __type: "TypeParameterTO",
          name: typeText,
        })
      )
      .case<to.TupleTO, { typeNode: ts.TupleTypeNode }>(
        ({ typeNode }) =>
          typeof typeNode !== "undefined" && ts.isTupleTypeNode(typeNode),
        ({ typeText, typeNode }) => ({
          __type: "TupleTO",
          typeName: typeText,
          items: typeNode.elements.map((typeNode) =>
            this.#convertType(this.#typeChecker.getTypeFromTypeNode(typeNode))
          ),
        })
      )
      .case<to.LiteralTO>(
        ({ type }) => type.isLiteral(),
        ({ type }) => ({
          __type: "LiteralTO",
          value: type.value,
        })
      )
      .case<to.LiteralTO>(
        ({ typeText }) => ["true", "false"].includes(typeText),
        ({ typeText }) => ({
          __type: "LiteralTO",
          value: typeText === "true" ? true : false,
        })
      )
      .case<to.PrimitiveTO>(
        ({ typeText }) => typeText === "string",
        () => primitive("string")
      )
      .case<to.PrimitiveTO>(
        ({ typeText }) => typeText === "number",
        () => primitive("number")
      )
      .case<to.PrimitiveTO>(
        ({ typeText }) => typeText === "bigint",
        () => primitive("bigint")
      )
      .case<to.PrimitiveTO>(
        ({ typeText }) => typeText === "boolean",
        () => primitive("boolean")
      )
      .case<to.SpecialTO>(
        ({ typeText }) => typeText === "null",
        () => special("null")
      )
      .case<to.SpecialTO>(
        ({ typeText }) => typeText === "undefined",
        () => special("undefined")
      )
      .case<to.SpecialTO>(
        ({ typeText }) => typeText === "void",
        () => special("void")
      )
      .case<to.SpecialTO>(
        ({ typeText }) => typeText === "any",
        () => special("any")
      )
      .case<to.SpecialTO>(
        ({ typeText }) => typeText === "unknown",
        () => special("unknown")
      )
      .case<to.SpecialTO>(
        ({ typeText }) => typeText === "never",
        () => special("never")
      )
      .case<to.SpecialTO>(
        ({ typeText }) => typeText === "Date",
        () => special("Date")
      )
      .case<to.ArrayTO>(
        ({ type, typeText }) =>
          typeText.endsWith("[]") || type.symbol?.escapedName === "Array",
        ({ type, typeText }) => ({
          __type: "ArrayTO",
          typeName: typeText,
          child: (() => {
            const resultT = this.#extractArrayT(type)
            return isOk(resultT)
              ? resultT.ok
              : ({ __type: "UnknownTO", kind: "arrayT" } as const)
          })(),
        })
      )
      .case<to.ObjectTO>(
        ({ type }) => this.#typeChecker.getPropertiesOfType(type).length !== 0,
        ({ type }) => this.#createObjectType(type)
      )
      .default<to.UnknownTO>(({ typeText }) => ({
        __type: "UnknownTO",
        kind: "convert",
        typeText,
      }))
  }

  #isCallable(type: ts.Type): boolean {
    return (
      this.#getMembers(type).findIndex(
        (member) =>
          unescapeLeadingUnderscores(member.getEscapedName()) === "__call"
      ) >= 0
    )
  }

  #getMembers(type: ts.Type): ts.Symbol[] {
    const members: ts.Symbol[] = []

    type.getSymbol()?.members?.forEach((memberSymbol) => {
      members.push(memberSymbol)
    })

    return members
  }

  #isTypeParametersResolved(type: ts.Type): boolean {
    return (
      (type.aliasTypeArguments ?? []).length === 0 ||
      // @ts-expect-error: wrong type def
      type.typeParameter !== undefined
    )
  }

  #typeToString(type: ts.Type) {
    return this.#typeChecker.typeToString(type).replace("typeof ", "")
  }
}
