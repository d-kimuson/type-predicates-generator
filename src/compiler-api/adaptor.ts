import type * as ts from "typescript"

/**
 * There are some properties that do not grow in the compiler API interface but do in reality.
 * This is the Adaptor layer to use these.
 * Since type checking is broken, it is necessary to check the implementation, especially when the version is upgraded.
 */

export class NodeAdaptor<T extends ts.Node> {
  public constructor(public readonly base: T) {}

  public get type(): ts.TypeNode | undefined {
    // @ts-expect-error -- compiler api missing
    return "type" in this.base ? (this.base.type as ts.TypeNode) : undefined
  }
  public get symbol(): ts.Symbol | undefined {
    // @ts-expect-error -- compiler api missing
    return "symbol" in this.base ? (this.base.symbol as ts.Symbol) : undefined
  }
}

export class TypeAdaptor<T extends ts.Type> {
  public constructor(public readonly base: T) {}

  public get types(): ts.Type[] {
    // @ts-expect-error -- compiler api missing
    return "types" in this.base ? (this.base.types as ts.Type[]) : []
  }

  public get resolvedTypeArguments(): ts.Type[] {
    return "resolvedTypeArguments" in this.base
      ? // @ts-expect-error -- compiler api missing
        (this.base.resolvedTypeArguments as ts.Type[])
      : []
  }

  public get value(): unknown {
    // @ts-expect-error -- compiler api missing
    return "value" in this.base ? this.base.value : undefined
  }

  public get node(): ts.Node | undefined {
    // @ts-expect-error -- compiler api missing
    return "node" in this.base ? (this.base.node as ts.Node) : undefined
  }
}
