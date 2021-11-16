import { expectType } from "tsd"
import type { Str } from "../types/primitive"
import {
  isHello,
  isStr,
  isAge,
  isTrue,
  isUnion,
  isArrStr,
  isObj,
} from "../type-predicates"

describe("primitive(Str)", () => {
  it("isStr", () => {
    const target = "hello" as unknown
    const _isStr = isStr(target)
    expect(_isStr).toBe(true)
    if (_isStr) {
      expectType<Str>(target)
    }

    expect(isStr(20)).toBe(false)
  })
})

describe("literal", () => {
  it("string literal", () => {
    expect(isHello("hello")).toBe(true)
    expect(isHello("helloWorld")).toBe(false)
  })

  it("number literal", () => {
    expect(isAge(20)).toBe(true)
    expect(isAge(25)).toBe(false)
  })

  it("boolean literal", () => {
    expect(isTrue(true)).toBe(true)
    expect(isTrue(false)).toBe(false)
  })
})

describe("union", () => {
  it("string literal", () => {
    // string | number
    expect(isUnion("hello")).toBe(true)
    expect(isUnion(20)).toBe(true)

    // else
    expect(isUnion(undefined)).toBe(false)
    expect(isUnion(["hello"])).toBe(false)
    expect(isUnion({ greet: "hello" })).toBe(false)
  })
})

describe("array", () => {
  it("string literal", () => {
    expect(isArrStr(["hello", "world"])).toBe(true) // string[]
    expect(isArrStr([])).toBe(true) // empty

    expect(isArrStr([-1, -1])).toBe(false) // type wrong
    expect(isArrStr(["hello", "world", -1])).toBe(false) // partially type wrong
    expect(isArrStr({ 0: "hello" })).toBe(false) // not array
  })
})

describe("object", () => {
  it("obj", () => {
    expect(
      isObj({
        name: "taro",
        names: ["taro"],
        maybeName: undefined,
        time: new Date(),
      })
    ).toBe(true)

    expect(
      isObj({
        name: "taro",
        names: ["taro"],
        maybeName: "taro",
        time: new Date(),
      })
    ).toBe(true)

    expect(
      isObj({
        name: "taro",
        names: ["taro"],
        maybeName: null, // wrong partially
        time: new Date(),
      })
    ).toBe(false)

    expect(isObj({})).toBe(false) // empty
    expect(isObj(undefined)).toBe(false) // not object
  })

  it('ommitable property', () => {
    expect(isObj({
        name: "taro",
        names: ["taro"],
        time: new Date(),
    })).toBe(true)
  })
})
