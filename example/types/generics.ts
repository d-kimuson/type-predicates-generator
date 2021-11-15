// should be resolved
export type GenericsWithDefault<T = string> = {
  value: T
}

// should be skipped
export type GenericsWithNoDefault<T extends string> = {
  value: T
}
