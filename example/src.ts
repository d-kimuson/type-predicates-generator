import { isUser, assertIsUser } from "./type-predicates"

let maybeUser: unknown
if (isUser(maybeUser)) {
  console.log(maybeUser) /* :User */
}

console.log(maybeUser) /* :unknown */
assertIsUser(maybeUser)

console.log(maybeUser) /* :User */
