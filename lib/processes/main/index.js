// @flow

// This helper module encapsulates all property accesses to global properties inside the main process.
// This way, we document the outside API of this process.
// And as a nice side-effect, it becomes easier to mock things in tests.

import type { MessageHandler } from "../../types"
import argv from "./argv"

const send: MessageHandler<*> | false =
    (typeof process.send === "function" && process.send.bind(process))

export default {
    argv,
    env: process.env,
    send
}
