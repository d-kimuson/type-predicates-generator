import { resolve } from "path"
import { CompilerApiHandler } from "~/compiler-api/compiler-api-handler"
import { createProgram } from "~/compiler-api/program"
import { isOk } from "~/utils"

const program = createProgram(resolve(__dirname, "../example/tsconfig.json"))
const handler = new CompilerApiHandler(program)

describe("convertType", () => {
  it("primitive", () => {
    const typesResult = handler.extractTypes(
      resolve(__dirname, "../example/types/primitive.ts")
    )
    expect(isOk(typesResult)).toBe(true)
    if (!isOk(typesResult)) {
      return
    }

    const types = typesResult.ok
    expect(types.length).toStrictEqual(2)

    expect(types[0]?.type).toStrictEqual({
      __type: "PrimitiveTO",
      kind: "string",
    })

    expect(types[1]?.type).toStrictEqual({
      __type: "PrimitiveTO",
      kind: "number",
    })
  })

  it("special", () => {
    const typesResult = handler.extractTypes(
      resolve(__dirname, "../example/types/special.ts")
    )
    expect(isOk(typesResult)).toBe(true)
    if (!isOk(typesResult)) {
      return
    }

    const types = typesResult.ok
    expect(types.length).toStrictEqual(2)

    expect(types[0]?.type).toStrictEqual({
      __type: "SpecialTO",
      kind: "undefined",
    })

    expect(types[1]?.type).toStrictEqual({
      __type: "SpecialTO",
      kind: "null",
    })
  })

  it("literal", () => {
    const typesResult = handler.extractTypes(
      resolve(__dirname, "../example/types/literal.ts")
    )
    expect(isOk(typesResult)).toBe(true)
    if (!isOk(typesResult)) {
      return
    }

    const types = typesResult.ok
    expect(types.length).toStrictEqual(3)

    expect(types[0]?.type).toStrictEqual({
      __type: "LiteralTO",
      value: "hello",
    })

    expect(types[1]?.type).toStrictEqual({
      __type: "LiteralTO",
      value: 20,
    })

    expect(types[2]?.type).toStrictEqual({
      __type: "LiteralTO",
      value: true,
    })
  })

  it("union", () => {
    const typesResult = handler.extractTypes(
      resolve(__dirname, "../example/types/union.ts")
    )
    expect(isOk(typesResult)).toBe(true)
    if (!isOk(typesResult)) {
      return
    }

    const types = typesResult.ok
    expect(types.length).toStrictEqual(1)

    expect(types[0]?.type).toStrictEqual({
      __type: "UnionTO",
      typeName: "Union",
      unions: [
        {
          __type: "PrimitiveTO",
          kind: "string",
        },
        {
          __type: "PrimitiveTO",
          kind: "number",
        },
      ],
    })
  })

  it("array", () => {
    const typesResult = handler.extractTypes(
      resolve(__dirname, "../example/types/array.ts")
    )
    expect(isOk(typesResult)).toBe(true)
    if (isOk(typesResult)) {
      const types = typesResult.ok
      expect(types.length).toStrictEqual(2)

      expect(types[0]?.type).toStrictEqual({
        __type: "ArrayTO",
        typeName: "ArrStr",
        child: {
          __type: "PrimitiveTO",
          kind: "string",
        },
      })

      expect(types[1]?.type).toStrictEqual({
        __type: "ArrayTO",
        typeName: "ArrStr2",
        child: {
          __type: "PrimitiveTO",
          kind: "string",
        },
      })
    }
  })

  it("object", () => {
    const typesResult = handler.extractTypes(
      resolve(__dirname, "../example/types/object.ts")
    )
    expect(isOk(typesResult)).toBe(true)
    if (!isOk(typesResult)) {
      return
    }

    const types = typesResult.ok
    expect(types.length).toStrictEqual(2)

    const [type1, type2] = types
    expect(type1?.type.__type).toStrictEqual("ObjectTO")
    if (type1?.type.__type !== "ObjectTO") {
      return
    }
    expect(type1?.type.getProps()).toStrictEqual([
      {
        propName: "name",
        type: {
          __type: "PrimitiveTO",
          kind: "string",
        },
      },
      {
        propName: "names",
        type: {
          __type: "ArrayTO",
          typeName: "string[]",
          child: {
            __type: "PrimitiveTO",
            kind: "string",
          },
        },
      },
      {
        propName: "maybeName",
        type: {
          __type: "UnionTO",
          typeName: "string | undefined",
          unions: [
            {
              __type: "SpecialTO",
              kind: "undefined",
            },
            {
              __type: "PrimitiveTO",
              kind: "string",
            },
          ],
        },
      },
      {
        propName: "time",
        type: {
          __type: "SpecialTO",
          kind: "Date",
        },
      },
    ])

    expect(type2?.type.__type).toStrictEqual("ObjectTO")
    if (type2?.type.__type !== "ObjectTO") {
      return
    }
    const propsOneRecursive = type2?.type.getProps()
    expect(propsOneRecursive[0]).toStrictEqual({
      propName: "name",
      type: {
        __type: "PrimitiveTO",
        kind: "string",
      },
    })
    const recursiveProp = propsOneRecursive[1]?.type
    if (recursiveProp?.__type === "ObjectTO") {
      expect(recursiveProp.getProps()[0]).toStrictEqual({
        propName: "name",
        type: {
          __type: "PrimitiveTO",
          kind: "string",
        },
      })
    }
  })

  it("generics", () => {
    const typesResult = handler.extractTypes(
      resolve(__dirname, "../example/types/generics.ts")
    )
    expect(isOk(typesResult)).toBe(true)
    if (isOk(typesResult)) {
      const [type_0, type_1] = typesResult.ok
      expect(type_0).toBeDefined()
      expect(type_1).not.toBeDefined()
      if (!type_0) return

      expect(type_0.typeName).toBe("ResultOfGenerics")
      expect(type_0.type.__type).toBe("ObjectTO")

      if (type_0.type.__type !== "ObjectTO") {
        return
      }

      expect(type_0.type.getProps()).toStrictEqual([
        {
          propName: "id",
          type: {
            __type: "UnionTO",
            typeName: "number | undefined",
            unions: [
              {
                __type: "SpecialTO",
                kind: "undefined",
              },
              {
                __type: "PrimitiveTO",
                kind: "number",
              },
            ],
          },
        },
        {
          propName: "time",
          type: {
            __type: "UnionTO",
            typeName: "Date | undefined",
            unions: [
              {
                __type: "SpecialTO",
                kind: "undefined",
              },
              {
                __type: "SpecialTO",
                kind: "Date",
              },
            ],
          },
        },
      ])
    }
  })
})
