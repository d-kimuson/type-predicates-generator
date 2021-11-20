type Base = {
  name: string,
  password: string,
  other: number
}

export type Complex = Partial<Pick<Base, 'name' | 'password'>>
