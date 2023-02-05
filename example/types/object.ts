export type Obj = {
  name: string
  names: string[]
  maybeName?: string
  maybeNames?: string[]
  hoge: () => void // should skip
  time: Date
}

export type RecursiveObj = {
  name: string
  child: RecursiveObj
}
