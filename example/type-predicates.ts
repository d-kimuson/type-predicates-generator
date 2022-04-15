import type { ArrStr, ArrStr2, ArrInProp } from './types/array';
import type { Complex } from './types/complex';
import type { User } from './types/entity';
import type { ResultOfGenerics } from './types/generics';
import type { Hello, Age, True } from './types/literal';
import type { Obj, RecursiveObj } from './types/object';
import type { Str, Num } from './types/primitive';
import type { Category, Order, Pet, Tag, PetStatusEnum } from './types/re-export';
import type { Undef, Null_ } from './types/special';
import type { TupleStr } from './types/tuple';
import type { StrOrNumber, BasicEnum, EnumWithValue } from './types/union';

const isString = (value: unknown): value is string => typeof value === 'string';
const isNumber = (value: unknown): value is number => typeof value === 'number';
const isUndefined = (value: unknown): value is undefined => typeof value === 'undefined';
const isDate = (value: unknown): value is Date =>
  value instanceof Date || Object.prototype.toString.call(value) === '[Object Date]'
const isNull = (value: unknown): value is null => value === null;
type ArrayCheckOption = 'all' | 'first';
const isArray = <T>(
  childCheckFn:
    | ((value: unknown) => value is T)
    | ((value: unknown) => boolean),
  checkOption: ArrayCheckOption = 'all'
) => (array: unknown): boolean =>
  Array.isArray(array) &&
  (checkOption === 'all'
    ? ((array) => {
        for (const val of array) {
          if (!childCheckFn(val)) return false
        }
        return true;
      })(array)
    : typeof array[0] === "undefined" || childCheckFn(array[0]));
const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);
const hasNotUnlistedProperties = (listedKeys: string[]) =>
  (value: Record<string, unknown>): boolean =>
    Object.keys(value).every(key => listedKeys.includes(key))
const isUnion = (unionChecks: ((value: unknown) => boolean)[]) =>
  (value: unknown): boolean =>
    unionChecks.reduce((s: boolean, isT) => s || isT(value), false)

/**
 * Check if a variable is of type {@link ArrStr} and narrow it down to that type if the check passes.
 * This function is automatically generated using [type-predicates-generator](https://www.npmjs.com/package/type-predicates-generator).
 * @param arg_0 Argument to inspect.
 * @param checkOpt Whether to check all elements of the array or only the first one.
 * @return `true` if the argument is of type {@link ArrStr}, `false` otherwise.
 */
export const isArrStr = (arg_0: unknown, checkOpt: ArrayCheckOption = 'all'): arg_0 is ArrStr => isArray(isString, checkOpt)(arg_0);
/**
 * Assert if a variable is of type {@link ArrStr} and throws a TypeError if the assertion fails.
 * This function is automatically generated using [type-predicates-generator](https://www.npmjs.com/package/type-predicates-generator).
 * @param value Argument to inspect.
 * @throw TypeError if the given argument is not compatible with the type {@link ArrStr}.
 */
export function assertIsArrStr(value: unknown): asserts value is ArrStr {
  if (!isArrStr(value)) throw new TypeError(`value must be ArrStr but received ${value}`)
};
/**
 * Check if a variable is of type {@link ArrStr2} and narrow it down to that type if the check passes.
 * This function is automatically generated using [type-predicates-generator](https://www.npmjs.com/package/type-predicates-generator).
 * @param arg_0 Argument to inspect.
 * @param checkOpt Whether to check all elements of the array or only the first one.
 * @return `true` if the argument is of type {@link ArrStr2}, `false` otherwise.
 */
export const isArrStr2 = (arg_0: unknown, checkOpt: ArrayCheckOption = 'all'): arg_0 is ArrStr2 => isArray(isString, checkOpt)(arg_0);
/**
 * Assert if a variable is of type {@link ArrStr2} and throws a TypeError if the assertion fails.
 * This function is automatically generated using [type-predicates-generator](https://www.npmjs.com/package/type-predicates-generator).
 * @param value Argument to inspect.
 * @throw TypeError if the given argument is not compatible with the type {@link ArrStr2}.
 */
export function assertIsArrStr2(value: unknown): asserts value is ArrStr2 {
  if (!isArrStr2(value)) throw new TypeError(`value must be ArrStr2 but received ${value}`)
};
/**
 * Check if a variable is of type {@link ArrInProp} and narrow it down to that type if the check passes.
 * This function is automatically generated using [type-predicates-generator](https://www.npmjs.com/package/type-predicates-generator).
 * @param arg_0 Argument to inspect.
 * @return `true` if the argument is of type {@link ArrInProp}, `false` otherwise.
 */
export const isArrInProp = (arg_0: unknown): arg_0 is ArrInProp => isObject(arg_0) && hasNotUnlistedProperties(['arr'])(arg_0) &&
  ('arr' in arg_0 && ((arg_1: unknown): boolean => isArray(isString)(arg_1))(arg_0['arr']));
/**
 * Assert if a variable is of type {@link ArrInProp} and throws a TypeError if the assertion fails.
 * This function is automatically generated using [type-predicates-generator](https://www.npmjs.com/package/type-predicates-generator).
 * @param value Argument to inspect.
 * @throw TypeError if the given argument is not compatible with the type {@link ArrInProp}.
 */
export function assertIsArrInProp(value: unknown): asserts value is ArrInProp {
  if (!isArrInProp(value)) throw new TypeError(`value must be ArrInProp but received ${value}`)
};
/**
 * Check if a variable is of type {@link Complex} and narrow it down to that type if the check passes.
 * This function is automatically generated using [type-predicates-generator](https://www.npmjs.com/package/type-predicates-generator).
 * @param arg_0 Argument to inspect.
 * @return `true` if the argument is of type {@link Complex}, `false` otherwise.
 */
export const isComplex = (arg_0: unknown): arg_0 is Complex => isObject(arg_0) && hasNotUnlistedProperties(['name', 'password'])(arg_0) &&
  (((arg_1: unknown): boolean => isUnion([isUndefined, isString])(arg_1))(arg_0['name'])) && (((arg_1: unknown): boolean => isUnion([isUndefined, isString])(arg_1))(arg_0['password']));
/**
 * Assert if a variable is of type {@link Complex} and throws a TypeError if the assertion fails.
 * This function is automatically generated using [type-predicates-generator](https://www.npmjs.com/package/type-predicates-generator).
 * @param value Argument to inspect.
 * @throw TypeError if the given argument is not compatible with the type {@link Complex}.
 */
export function assertIsComplex(value: unknown): asserts value is Complex {
  if (!isComplex(value)) throw new TypeError(`value must be Complex but received ${value}`)
};
/**
 * Check if a variable is of type {@link User} and narrow it down to that type if the check passes.
 * This function is automatically generated using [type-predicates-generator](https://www.npmjs.com/package/type-predicates-generator).
 * @param arg_0 Argument to inspect.
 * @return `true` if the argument is of type {@link User}, `false` otherwise.
 */
export const isUser = (arg_0: unknown): arg_0 is User => isObject(arg_0) && hasNotUnlistedProperties(['id', 'firstName', 'lastName'])(arg_0) &&
  ('id' in arg_0 && (isNumber)(arg_0['id'])) && ('firstName' in arg_0 && (isString)(arg_0['firstName'])) && ('lastName' in arg_0 && (isString)(arg_0['lastName']));
/**
 * Assert if a variable is of type {@link User} and throws a TypeError if the assertion fails.
 * This function is automatically generated using [type-predicates-generator](https://www.npmjs.com/package/type-predicates-generator).
 * @param value Argument to inspect.
 * @throw TypeError if the given argument is not compatible with the type {@link User}.
 */
export function assertIsUser(value: unknown): asserts value is User {
  if (!isUser(value)) throw new TypeError(`value must be User but received ${value}`)
};
/**
 * Check if a variable is of type {@link ResultOfGenerics} and narrow it down to that type if the check passes.
 * This function is automatically generated using [type-predicates-generator](https://www.npmjs.com/package/type-predicates-generator).
 * @param arg_0 Argument to inspect.
 * @return `true` if the argument is of type {@link ResultOfGenerics}, `false` otherwise.
 */
export const isResultOfGenerics = (arg_0: unknown): arg_0 is ResultOfGenerics => isObject(arg_0) && hasNotUnlistedProperties(['id', 'time'])(arg_0) &&
  (((arg_1: unknown): boolean => isUnion([isUndefined, isNumber])(arg_1))(arg_0['id'])) && (((arg_1: unknown): boolean => isUnion([isUndefined, isDate])(arg_1))(arg_0['time']));
/**
 * Assert if a variable is of type {@link ResultOfGenerics} and throws a TypeError if the assertion fails.
 * This function is automatically generated using [type-predicates-generator](https://www.npmjs.com/package/type-predicates-generator).
 * @param value Argument to inspect.
 * @throw TypeError if the given argument is not compatible with the type {@link ResultOfGenerics}.
 */
export function assertIsResultOfGenerics(value: unknown): asserts value is ResultOfGenerics {
  if (!isResultOfGenerics(value)) throw new TypeError(`value must be ResultOfGenerics but received ${value}`)
};
/**
 * Check if a variable is of type {@link Hello} and narrow it down to that type if the check passes.
 * This function is automatically generated using [type-predicates-generator](https://www.npmjs.com/package/type-predicates-generator).
 * @param arg_0 Argument to inspect.
 * @return `true` if the argument is of type {@link Hello}, `false` otherwise.
 */
export const isHello = (arg_0: unknown): arg_0 is Hello => arg_0 === "hello";
/**
 * Assert if a variable is of type {@link Hello} and throws a TypeError if the assertion fails.
 * This function is automatically generated using [type-predicates-generator](https://www.npmjs.com/package/type-predicates-generator).
 * @param value Argument to inspect.
 * @throw TypeError if the given argument is not compatible with the type {@link Hello}.
 */
export function assertIsHello(value: unknown): asserts value is Hello {
  if (!isHello(value)) throw new TypeError(`value must be Hello but received ${value}`)
};
/**
 * Check if a variable is of type {@link Age} and narrow it down to that type if the check passes.
 * This function is automatically generated using [type-predicates-generator](https://www.npmjs.com/package/type-predicates-generator).
 * @param arg_0 Argument to inspect.
 * @return `true` if the argument is of type {@link Age}, `false` otherwise.
 */
export const isAge = (arg_0: unknown): arg_0 is Age => arg_0 === 20;
/**
 * Assert if a variable is of type {@link Age} and throws a TypeError if the assertion fails.
 * This function is automatically generated using [type-predicates-generator](https://www.npmjs.com/package/type-predicates-generator).
 * @param value Argument to inspect.
 * @throw TypeError if the given argument is not compatible with the type {@link Age}.
 */
export function assertIsAge(value: unknown): asserts value is Age {
  if (!isAge(value)) throw new TypeError(`value must be Age but received ${value}`)
};
/**
 * Check if a variable is of type {@link True} and narrow it down to that type if the check passes.
 * This function is automatically generated using [type-predicates-generator](https://www.npmjs.com/package/type-predicates-generator).
 * @param arg_0 Argument to inspect.
 * @return `true` if the argument is of type {@link True}, `false` otherwise.
 */
export const isTrue = (arg_0: unknown): arg_0 is True => arg_0 === true;
/**
 * Assert if a variable is of type {@link True} and throws a TypeError if the assertion fails.
 * This function is automatically generated using [type-predicates-generator](https://www.npmjs.com/package/type-predicates-generator).
 * @param value Argument to inspect.
 * @throw TypeError if the given argument is not compatible with the type {@link True}.
 */
export function assertIsTrue(value: unknown): asserts value is True {
  if (!isTrue(value)) throw new TypeError(`value must be True but received ${value}`)
};
/**
 * Check if a variable is of type {@link Obj} and narrow it down to that type if the check passes.
 * This function is automatically generated using [type-predicates-generator](https://www.npmjs.com/package/type-predicates-generator).
 * @param arg_0 Argument to inspect.
 * @return `true` if the argument is of type {@link Obj}, `false` otherwise.
 */
export const isObj = (arg_0: unknown): arg_0 is Obj => isObject(arg_0) && hasNotUnlistedProperties(['name', 'names', 'maybeName', 'time'])(arg_0) &&
  ('name' in arg_0 && (isString)(arg_0['name'])) && ('names' in arg_0 && ((arg_1: unknown): boolean => isArray(isString)(arg_1))(arg_0['names'])) && (((arg_1: unknown): boolean => isUnion([isUndefined, isString])(arg_1))(arg_0['maybeName'])) && ('time' in arg_0 && (isDate)(arg_0['time']));
/**
 * Assert if a variable is of type {@link Obj} and throws a TypeError if the assertion fails.
 * This function is automatically generated using [type-predicates-generator](https://www.npmjs.com/package/type-predicates-generator).
 * @param value Argument to inspect.
 * @throw TypeError if the given argument is not compatible with the type {@link Obj}.
 */
export function assertIsObj(value: unknown): asserts value is Obj {
  if (!isObj(value)) throw new TypeError(`value must be Obj but received ${value}`)
};
/**
 * Check if a variable is of type {@link RecursiveObj} and narrow it down to that type if the check passes.
 * This function is automatically generated using [type-predicates-generator](https://www.npmjs.com/package/type-predicates-generator).
 * @param arg_0 Argument to inspect.
 * @return `true` if the argument is of type {@link RecursiveObj}, `false` otherwise.
 */
export const isRecursiveObj = (arg_0: unknown): arg_0 is RecursiveObj => isObject(arg_0) && hasNotUnlistedProperties(['name', 'child'])(arg_0) &&
  ('name' in arg_0 && (isString)(arg_0['name'])) && ('child' in arg_0 && (isRecursiveObj)(arg_0['child']));
/**
 * Assert if a variable is of type {@link RecursiveObj} and throws a TypeError if the assertion fails.
 * This function is automatically generated using [type-predicates-generator](https://www.npmjs.com/package/type-predicates-generator).
 * @param value Argument to inspect.
 * @throw TypeError if the given argument is not compatible with the type {@link RecursiveObj}.
 */
export function assertIsRecursiveObj(value: unknown): asserts value is RecursiveObj {
  if (!isRecursiveObj(value)) throw new TypeError(`value must be RecursiveObj but received ${value}`)
};
/**
 * Check if a variable is of type {@link Str} and narrow it down to that type if the check passes.
 * This function is automatically generated using [type-predicates-generator](https://www.npmjs.com/package/type-predicates-generator).
 * @param arg_0 Argument to inspect.
 * @return `true` if the argument is of type {@link Str}, `false` otherwise.
 */
export const isStr = isString;
/**
 * Assert if a variable is of type {@link Str} and throws a TypeError if the assertion fails.
 * This function is automatically generated using [type-predicates-generator](https://www.npmjs.com/package/type-predicates-generator).
 * @param value Argument to inspect.
 * @throw TypeError if the given argument is not compatible with the type {@link Str}.
 */
export function assertIsStr(value: unknown): asserts value is Str {
  if (!isStr(value)) throw new TypeError(`value must be Str but received ${value}`)
};
/**
 * Check if a variable is of type {@link Num} and narrow it down to that type if the check passes.
 * This function is automatically generated using [type-predicates-generator](https://www.npmjs.com/package/type-predicates-generator).
 * @param arg_0 Argument to inspect.
 * @return `true` if the argument is of type {@link Num}, `false` otherwise.
 */
export const isNum = isNumber;
/**
 * Assert if a variable is of type {@link Num} and throws a TypeError if the assertion fails.
 * This function is automatically generated using [type-predicates-generator](https://www.npmjs.com/package/type-predicates-generator).
 * @param value Argument to inspect.
 * @throw TypeError if the given argument is not compatible with the type {@link Num}.
 */
export function assertIsNum(value: unknown): asserts value is Num {
  if (!isNum(value)) throw new TypeError(`value must be Num but received ${value}`)
};

/**
 * Check if a variable is of type {@link Category} and narrow it down to that type if the check passes.
 * This function is automatically generated using [type-predicates-generator](https://www.npmjs.com/package/type-predicates-generator).
 * @param arg_0 Argument to inspect.
 * @return `true` if the argument is of type {@link Category}, `false` otherwise.
 */
export const isCategory = (arg_0: unknown): arg_0 is Category => isObject(arg_0) && hasNotUnlistedProperties(['id', 'name'])(arg_0) &&
  (((arg_1: unknown): boolean => isUnion([isUndefined, isNumber])(arg_1))(arg_0['id'])) && (((arg_1: unknown): boolean => isUnion([isUndefined, isString])(arg_1))(arg_0['name']));
/**
 * Assert if a variable is of type {@link Category} and throws a TypeError if the assertion fails.
 * This function is automatically generated using [type-predicates-generator](https://www.npmjs.com/package/type-predicates-generator).
 * @param value Argument to inspect.
 * @throw TypeError if the given argument is not compatible with the type {@link Category}.
 */
export function assertIsCategory(value: unknown): asserts value is Category {
  if (!isCategory(value)) throw new TypeError(`value must be Category but received ${value}`)
};
/**
 * Check if a variable is of type {@link Order} and narrow it down to that type if the check passes.
 * This function is automatically generated using [type-predicates-generator](https://www.npmjs.com/package/type-predicates-generator).
 * @param arg_0 Argument to inspect.
 * @return `true` if the argument is of type {@link Order}, `false` otherwise.
 */
export const isOrder = (arg_0: unknown): arg_0 is Order => isObject(arg_0) && hasNotUnlistedProperties(['id', 'petId', 'quantity', 'shipDate', 'status', 'complete'])(arg_0) &&
  (((arg_1: unknown): boolean => isUnion([isUndefined, isNumber])(arg_1))(arg_0['id'])) && (((arg_1: unknown): boolean => isUnion([isUndefined, isNumber])(arg_1))(arg_0['petId'])) && (((arg_1: unknown): boolean => isUnion([isUndefined, isNumber])(arg_1))(arg_0['quantity'])) && (((arg_1: unknown): boolean => isUnion([isUndefined, isString])(arg_1))(arg_0['shipDate'])) && (((arg_1: unknown): boolean => isUnion([isUndefined, (arg_2: unknown): boolean => arg_2 === "placed", (arg_2: unknown): boolean => arg_2 === "approved", (arg_2: unknown): boolean => arg_2 === "delivered"])(arg_1))(arg_0['status'])) && (((arg_1: unknown): boolean => isUnion([isUndefined, (arg_2: unknown): boolean => arg_2 === false, (arg_2: unknown): boolean => arg_2 === true])(arg_1))(arg_0['complete']));
/**
 * Assert if a variable is of type {@link Order} and throws a TypeError if the assertion fails.
 * This function is automatically generated using [type-predicates-generator](https://www.npmjs.com/package/type-predicates-generator).
 * @param value Argument to inspect.
 * @throw TypeError if the given argument is not compatible with the type {@link Order}.
 */
export function assertIsOrder(value: unknown): asserts value is Order {
  if (!isOrder(value)) throw new TypeError(`value must be Order but received ${value}`)
};
/**
 * Check if a variable is of type {@link Pet} and narrow it down to that type if the check passes.
 * This function is automatically generated using [type-predicates-generator](https://www.npmjs.com/package/type-predicates-generator).
 * @param arg_0 Argument to inspect.
 * @return `true` if the argument is of type {@link Pet}, `false` otherwise.
 */
export const isPet = (arg_0: unknown): arg_0 is Pet => isObject(arg_0) && hasNotUnlistedProperties(['id', 'category', 'name', 'photoUrls', 'tags', 'status'])(arg_0) &&
  (((arg_1: unknown): boolean => isUnion([isUndefined, isNumber])(arg_1))(arg_0['id'])) && (((arg_1: unknown): boolean => isUnion([isUndefined, (arg_2: unknown): boolean => isObject(arg_2) && hasNotUnlistedProperties(['name', 'id'])(arg_2) &&
  (((arg_3: unknown): boolean => isUnion([isUndefined, isString])(arg_3))(arg_2['name'])) && (((arg_3: unknown): boolean => isUnion([isUndefined, isNumber])(arg_3))(arg_2['id']))])(arg_1))(arg_0['category'])) && ('name' in arg_0 && (isString)(arg_0['name'])) && ('photoUrls' in arg_0 && ((arg_1: unknown): boolean => isArray(isString)(arg_1))(arg_0['photoUrls'])) && (((arg_1: unknown): boolean => isUnion([isUndefined, (arg_2: unknown): boolean => isArray(isTag)(arg_2)])(arg_1))(arg_0['tags'])) && (((arg_1: unknown): boolean => isUnion([isUndefined, (arg_2: unknown): boolean => arg_2 === "available", (arg_2: unknown): boolean => arg_2 === "pending", (arg_2: unknown): boolean => arg_2 === "sold"])(arg_1))(arg_0['status']));
/**
 * Assert if a variable is of type {@link Pet} and throws a TypeError if the assertion fails.
 * This function is automatically generated using [type-predicates-generator](https://www.npmjs.com/package/type-predicates-generator).
 * @param value Argument to inspect.
 * @throw TypeError if the given argument is not compatible with the type {@link Pet}.
 */
export function assertIsPet(value: unknown): asserts value is Pet {
  if (!isPet(value)) throw new TypeError(`value must be Pet but received ${value}`)
};
/**
 * Check if a variable is of type {@link Tag} and narrow it down to that type if the check passes.
 * This function is automatically generated using [type-predicates-generator](https://www.npmjs.com/package/type-predicates-generator).
 * @param arg_0 Argument to inspect.
 * @return `true` if the argument is of type {@link Tag}, `false` otherwise.
 */
export const isTag = (arg_0: unknown): arg_0 is Tag => isObject(arg_0) && hasNotUnlistedProperties(['id', 'name'])(arg_0) &&
  (((arg_1: unknown): boolean => isUnion([isUndefined, isNumber])(arg_1))(arg_0['id'])) && (((arg_1: unknown): boolean => isUnion([isUndefined, isString])(arg_1))(arg_0['name']));
/**
 * Assert if a variable is of type {@link Tag} and throws a TypeError if the assertion fails.
 * This function is automatically generated using [type-predicates-generator](https://www.npmjs.com/package/type-predicates-generator).
 * @param value Argument to inspect.
 * @throw TypeError if the given argument is not compatible with the type {@link Tag}.
 */
export function assertIsTag(value: unknown): asserts value is Tag {
  if (!isTag(value)) throw new TypeError(`value must be Tag but received ${value}`)
};
/**
 * Check if a variable is of type {@link PetStatusEnum} and narrow it down to that type if the check passes.
 * This function is automatically generated using [type-predicates-generator](https://www.npmjs.com/package/type-predicates-generator).
 * @param arg_0 Argument to inspect.
 * @return `true` if the argument is of type {@link PetStatusEnum}, `false` otherwise.
 */
export const isPetStatusEnum = (arg_0: unknown): arg_0 is PetStatusEnum => isUnion([(arg_1: unknown): boolean => arg_1 === "available", (arg_1: unknown): boolean => arg_1 === "pending", (arg_1: unknown): boolean => arg_1 === "sold"])(arg_0);
/**
 * Assert if a variable is of type {@link PetStatusEnum} and throws a TypeError if the assertion fails.
 * This function is automatically generated using [type-predicates-generator](https://www.npmjs.com/package/type-predicates-generator).
 * @param value Argument to inspect.
 * @throw TypeError if the given argument is not compatible with the type {@link PetStatusEnum}.
 */
export function assertIsPetStatusEnum(value: unknown): asserts value is PetStatusEnum {
  if (!isPetStatusEnum(value)) throw new TypeError(`value must be PetStatusEnum but received ${value}`)
};


/**
 * Check if a variable is of type {@link Undef} and narrow it down to that type if the check passes.
 * This function is automatically generated using [type-predicates-generator](https://www.npmjs.com/package/type-predicates-generator).
 * @param arg_0 Argument to inspect.
 * @return `true` if the argument is of type {@link Undef}, `false` otherwise.
 */
export const isUndef = isUndefined;
/**
 * Assert if a variable is of type {@link Undef} and throws a TypeError if the assertion fails.
 * This function is automatically generated using [type-predicates-generator](https://www.npmjs.com/package/type-predicates-generator).
 * @param value Argument to inspect.
 * @throw TypeError if the given argument is not compatible with the type {@link Undef}.
 */
export function assertIsUndef(value: unknown): asserts value is Undef {
  if (!isUndef(value)) throw new TypeError(`value must be Undef but received ${value}`)
};
/**
 * Check if a variable is of type {@link Null_} and narrow it down to that type if the check passes.
 * This function is automatically generated using [type-predicates-generator](https://www.npmjs.com/package/type-predicates-generator).
 * @param arg_0 Argument to inspect.
 * @return `true` if the argument is of type {@link Null_}, `false` otherwise.
 */
export const isNull_ = isNull;
/**
 * Assert if a variable is of type {@link Null_} and throws a TypeError if the assertion fails.
 * This function is automatically generated using [type-predicates-generator](https://www.npmjs.com/package/type-predicates-generator).
 * @param value Argument to inspect.
 * @throw TypeError if the given argument is not compatible with the type {@link Null_}.
 */
export function assertIsNull_(value: unknown): asserts value is Null_ {
  if (!isNull_(value)) throw new TypeError(`value must be Null_ but received ${value}`)
};
/**
 * Check if a variable is of type {@link TupleStr} and narrow it down to that type if the check passes.
 * This function is automatically generated using [type-predicates-generator](https://www.npmjs.com/package/type-predicates-generator).
 * @param arg_0 Argument to inspect.
 * @return `true` if the argument is of type {@link TupleStr}, `false` otherwise.
 */
export const isTupleStr = (arg_0: unknown): arg_0 is TupleStr => Array.isArray(arg_0) && ((isString)(arg_0[0]) && (isNumber)(arg_0[1]) && (isObj)(arg_0[2]));
/**
 * Assert if a variable is of type {@link TupleStr} and throws a TypeError if the assertion fails.
 * This function is automatically generated using [type-predicates-generator](https://www.npmjs.com/package/type-predicates-generator).
 * @param value Argument to inspect.
 * @throw TypeError if the given argument is not compatible with the type {@link TupleStr}.
 */
export function assertIsTupleStr(value: unknown): asserts value is TupleStr {
  if (!isTupleStr(value)) throw new TypeError(`value must be TupleStr but received ${value}`)
};
/**
 * Check if a variable is of type {@link StrOrNumber} and narrow it down to that type if the check passes.
 * This function is automatically generated using [type-predicates-generator](https://www.npmjs.com/package/type-predicates-generator).
 * @param arg_0 Argument to inspect.
 * @return `true` if the argument is of type {@link StrOrNumber}, `false` otherwise.
 */
export const isStrOrNumber = (arg_0: unknown): arg_0 is StrOrNumber => isUnion([isString, isNumber])(arg_0);
/**
 * Assert if a variable is of type {@link StrOrNumber} and throws a TypeError if the assertion fails.
 * This function is automatically generated using [type-predicates-generator](https://www.npmjs.com/package/type-predicates-generator).
 * @param value Argument to inspect.
 * @throw TypeError if the given argument is not compatible with the type {@link StrOrNumber}.
 */
export function assertIsStrOrNumber(value: unknown): asserts value is StrOrNumber {
  if (!isStrOrNumber(value)) throw new TypeError(`value must be StrOrNumber but received ${value}`)
};
/**
 * Check if a variable is of type {@link BasicEnum} and narrow it down to that type if the check passes.
 * This function is automatically generated using [type-predicates-generator](https://www.npmjs.com/package/type-predicates-generator).
 * @param arg_0 Argument to inspect.
 * @return `true` if the argument is of type {@link BasicEnum}, `false` otherwise.
 */
export const isBasicEnum = (arg_0: unknown): arg_0 is BasicEnum => isUnion([(arg_1: unknown): boolean => arg_1 === 0, (arg_1: unknown): boolean => arg_1 === 1, (arg_1: unknown): boolean => arg_1 === 2])(arg_0);
/**
 * Assert if a variable is of type {@link BasicEnum} and throws a TypeError if the assertion fails.
 * This function is automatically generated using [type-predicates-generator](https://www.npmjs.com/package/type-predicates-generator).
 * @param value Argument to inspect.
 * @throw TypeError if the given argument is not compatible with the type {@link BasicEnum}.
 */
export function assertIsBasicEnum(value: unknown): asserts value is BasicEnum {
  if (!isBasicEnum(value)) throw new TypeError(`value must be BasicEnum but received ${value}`)
};
/**
 * Check if a variable is of type {@link EnumWithValue} and narrow it down to that type if the check passes.
 * This function is automatically generated using [type-predicates-generator](https://www.npmjs.com/package/type-predicates-generator).
 * @param arg_0 Argument to inspect.
 * @return `true` if the argument is of type {@link EnumWithValue}, `false` otherwise.
 */
export const isEnumWithValue = (arg_0: unknown): arg_0 is EnumWithValue => isUnion([(arg_1: unknown): boolean => arg_1 === "red", (arg_1: unknown): boolean => arg_1 === "blue", (arg_1: unknown): boolean => arg_1 === "green"])(arg_0);
/**
 * Assert if a variable is of type {@link EnumWithValue} and throws a TypeError if the assertion fails.
 * This function is automatically generated using [type-predicates-generator](https://www.npmjs.com/package/type-predicates-generator).
 * @param value Argument to inspect.
 * @throw TypeError if the given argument is not compatible with the type {@link EnumWithValue}.
 */
export function assertIsEnumWithValue(value: unknown): asserts value is EnumWithValue {
  if (!isEnumWithValue(value)) throw new TypeError(`value must be EnumWithValue but received ${value}`)
};