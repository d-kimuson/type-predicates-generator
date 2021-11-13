import { isUser, assertIsUser } from "./generated"

let maybeUser: unknown
if (isUser(maybeUser)) {
  console.log(maybeUser) /* :User */
}

console.log(maybeUser) /* :unknown */
assertIsUser(maybeUser)

console.log(maybeUser) /* :User */
