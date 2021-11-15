import * as ts from "typescript"
import { forEachChild, ArrayTypeNode } from "typescript"
import { Result, ok, ng, switchExpression, isOk } from "~/utils"

import type * as to from "../type-object"
import { primitive, special } from "../type-object"

const genericsTypeText = /(.*?)<(.*?)>/

export class CompilerApiHandler {
  #program: ts.Program
  #typeChecker: ts.TypeChecker

  constructor(program: ts.Program) {
    this.#program = program
    this.#typeChecker = this.#program.getTypeChecker()
  }

  public extractTypes(
    filePath: string
  ): Result<
    { typeName: string | undefined; type: to.TypeObject }[],
    { reason: "fileNotFound" }
  > {
    const sourceFile = this.#program.getSourceFile(filePath)

    if (!sourceFile) {
      return ng({
        reason: "fileNotFound",
      })
    }

    const nodes = this.#extractNodes(sourceFile)
      .filter(
        (node): node is ts.TypeAliasDeclaration | ts.InterfaceDeclaration =>
          ts.isInterfaceDeclaration(node) || ts.isTypeAliasDeclaration(node)
      )
      // @ts-expect-error exclude not exported type def
      .filter((node) => typeof node?.localSymbol !== "undefined")
      .filter(
        (node) =>
          !genericsTypeText.test(
            this.#typeToString(this.#typeChecker.getTypeAtLocation(node))
          )
      )

    return ok(
      nodes.map((node) => ({
        typeName:
          typeof node?.symbol?.escapedName !== "undefined"
            ? String(node?.symbol?.escapedName)
            : undefined,
        type: this.#convertType(this.#typeChecker.getTypeAtLocation(node)),
      }))
    )
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
        this.#typeChecker.getPropertiesOfType(tsType).map(
          (
            symbol
          ): {
            propName: string
            type: to.TypeObject
          } => {
            const typeNode = symbol.valueDeclaration?.type

            return {
              propName: String(symbol.escapedName),
              type:
                typeNode && ts.isArrayTypeNode(typeNode)
                  ? {
                      __type: "ArrayTO",
                      typeName: this.#typeToString(
                        this.#typeChecker.getTypeFromTypeNode(typeNode)
                      ),
                      child: this.#extractArrayTFromTypeNode(typeNode),
                    }
                  : typeNode
                  ? this.#convertType(
                      this.#typeChecker.getTypeFromTypeNode(typeNode)
                    )
                  : {
                      __type: "UnknownTO",
                    },
            }
          }
        ),
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

  #convertType(type: ts.Type): to.TypeObject {
    return switchExpression({
      type,
      typeText: this.#typeToString(type),
    })
      .case<to.UnionTO>(({ type }) => type.isUnion(), {
        __type: "UnionTO",
        typeName: this.#typeToString(type),
        unions: (type?.types ?? []).map((type) => this.#convertType(type)),
      })
      .case<to.LiteralTO>(({ type }) => type.isLiteral(), {
        __type: "LiteralTO",
        value: type.value,
      })
      .case<to.LiteralTO>(
        ({ typeText }) => ["true", "false"].includes(typeText),
        {
          __type: "LiteralTO",
          value: this.#typeToString(type) === "true" ? true : false,
        }
      )
      .case<to.PrimitiveTO>(
        ({ typeText }) => typeText === "string",
        primitive("string")
      )
      .case<to.PrimitiveTO>(
        ({ typeText }) => typeText === "number",
        primitive("number")
      )
      .case<to.PrimitiveTO>(
        ({ typeText }) => typeText === "bigint",
        primitive("bigint")
      )
      .case<to.PrimitiveTO>(
        ({ typeText }) => typeText === "boolean",
        primitive("boolean")
      )
      .case<to.SpecialTO>(
        ({ typeText }) => typeText === "null",
        special("null")
      )
      .case<to.SpecialTO>(
        ({ typeText }) => typeText === "undefined",
        special("undefined")
      )
      .case<to.SpecialTO>(
        ({ typeText }) => typeText === "void",
        special("void")
      )
      .case<to.SpecialTO>(({ typeText }) => typeText === "any", special("any"))
      .case<to.SpecialTO>(
        ({ typeText }) => typeText === "unknown",
        special("unknown")
      )
      .case<to.SpecialTO>(
        ({ typeText }) => typeText === "never",
        special("never")
      )
      .case<to.ArrayTO>(
        ({ type, typeText }) =>
          typeText.endsWith("[]") || type.symbol?.escapedName === "Array",
        {
          __type: "ArrayTO",
          typeName: this.#typeToString(type),
          child: (() => {
            const resultT = this.#extractArrayT(type)
            return isOk(resultT)
              ? resultT.ok
              : ({ __type: "UnknownTO" } as const)
          })(),
        }
      )
      .case<to.ObjectTO>(
        ({ type }) => this.#typeChecker.getPropertiesOfType(type).length !== 0,
        this.#createObjectType(type)
      )
      .default<to.UnknownTO>({
        __type: "UnknownTO",
      })
  }

  #typeToString(type: ts.Type) {
    return this.#typeChecker.typeToString(type).replace("typeof ", "")
  }
}
