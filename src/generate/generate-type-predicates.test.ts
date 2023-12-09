import { describe, it, expect } from "vitest"
import { isMaybeUndefined } from "./generate-type-predicates"

describe("isMaybeUndefined", () => {
  it("exact undefined", () => {
    expect(
      isMaybeUndefined({
        __type: "SpecialTO",
        kind: "undefined",
      })
    ).toBe(true)
  })

  it("exact null", () => {
    expect(
      isMaybeUndefined({
        __type: "SpecialTO",
        kind: "null",
      })
    ).toBe(false)
  })

  it("undefined or something", () => {
    expect(
      isMaybeUndefined({
        __type: "UnionTO",
        typeName: "string | undefined",
        unions: [
          {
            __type: "PrimitiveTO",
            kind: "string",
          },
          {
            __type: "SpecialTO",
            kind: "undefined",
          },
        ],
      })
    ).toBe(true)
  })

  it("union", () => {
    expect(
      isMaybeUndefined({
        __type: "UnionTO",
        typeName: "string | null",
        unions: [
          {
            __type: "PrimitiveTO",
            kind: "string",
          },
          {
            __type: "SpecialTO",
            kind: "null",
          },
        ],
      })
    ).toBe(false)
  })
})
