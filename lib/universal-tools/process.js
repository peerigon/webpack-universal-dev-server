// @flow

// This helper module encapsulates all property accesses to global properties inside the appServer.
// This way, we document the outside API of this process.
// And as a nice side-effect, it becomes easier to mock things in tests.

import type { MessageHandler, Noop } from "./types"

const noop: Noop = () => void null

const send: MessageHandler<*> =
    (typeof process.send === "function" && process.send.bind(process)) ||
    noop

export default {
    send
}
