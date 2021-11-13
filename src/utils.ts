export type Result<S, T> = ResultOk<S> | ResultNg<T>
export type ResultOk<T> = {
  __type: "ok"
  ok: T
}
export type ResultNg<T> = {
  __type: "ng"
  ng: T
}

export function isOk<T, E>(result: Result<T, E>): result is ResultOk<T> {
  return result.__type === "ok"
}

export function isNg<T, E>(result: Result<T, E>): result is ResultNg<E> {
  return result.__type === "ng"
}

export function ok<T>(value: T): ResultOk<T> {
  return {
    __type: "ok",
    ok: value,
  }
}

export function ng<T>(value: T): ResultNg<T> {
  return {
    __type: "ng",
    ng: value,
  }
}

type IsMatch<T> = (target: T) => boolean
type SwitchResolve<T> = T

type SwitchResult<T, R> = {
  case: <CaseR>(
    isMatch: IsMatch<T>,
    resolve: SwitchResolve<CaseR>
  ) => SwitchResult<T, R | CaseR>
  default: <Default>(resolve: SwitchResolve<Default>) => R | Default
  resolved?: R
}

const toResult = <T, R>(
  target: T,
  isParentMatch: IsMatch<T>,
  resolveParent: SwitchResolve<R>,
  parentResolved: R | undefined
): SwitchResult<T, R> => {
  const resolved =
    typeof parentResolved === "undefined"
      ? isParentMatch(target)
        ? resolveParent
        : undefined
      : parentResolved

  return {
    resolved,
    default: <Default>(_default: Default): R | Default => resolved ?? _default,
    case: <CaseR>(
      isMatch: IsMatch<T>,
      resolve: SwitchResolve<CaseR>
    ): SwitchResult<T, R | CaseR> =>
      toResult<T, R | CaseR>(target, isMatch, resolve, resolved),
  }
}

export const switchExpression = <T>(target: T): SwitchResult<T, never> => {
  return {
    resolved: undefined,
    default: <Default>(_default: Default): Default => _default,
    case: <CaseR>(
      isMatch: IsMatch<T>,
      resolve: SwitchResolve<CaseR>
    ): SwitchResult<T, CaseR> =>
      toResult<T, CaseR>(target, isMatch, resolve, undefined),
  }
}
