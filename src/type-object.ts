import type * as ts from "typescript"

export type TypeObject =
  | PrimitiveTO
  | LiteralTO
  | SpecialTO
  | ArrayTO
  | ObjectTO
  | UnionTO
  | UnknownTO
  | SkipTO

type TypeNameTrait = {
  typeName: string
}

export type PrimitiveTO = {
  __type: "PrimitiveTO"
  kind: "string" | "number" | "bigint" | "boolean"
}

export type SpecialTO = {
  __type: "SpecialTO"
  kind: "null" | "undefined" | "any" | "unknown" | "never" | "void" | "Date"
}

export type LiteralTO = {
  __type: "LiteralTO"
  value: unknown
}

export type ArrayTO = TypeNameTrait & {
  __type: "ArrayTO"
  child: TypeObject
}

export type ObjectTO = TypeNameTrait & {
  __type: "ObjectTO"
  tsType: ts.Type // 再帰型を後から解決するため
  getProps: () => {
    propName: string
    type: TypeObject
  }[]
}

export type UnionTO = TypeNameTrait & {
  __type: "UnionTO"
  unions: TypeObject[]
}

// サポートしてない型(スキップする)
export type SkipTO = {
  __type: "SkipTO"
}

// 分岐を抜けた未知の型
export type UnknownTO = {
  __type: "UnknownTO"
}

export function primitive(kind: PrimitiveTO["kind"]): PrimitiveTO {
  return {
    __type: "PrimitiveTO",
    kind,
  }
}

export function special(kind: SpecialTO["kind"]): SpecialTO {
  return {
    __type: "SpecialTO",
    kind,
  }
}

export function skip(): SkipTO {
  return {
    __type: "SkipTO",
  }
}
