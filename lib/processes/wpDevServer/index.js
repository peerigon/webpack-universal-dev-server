// @flow

// This helper module encapsulates all property accesses to global properties inside the wpDevServer.
// This way, we document the outside API of this process.
// And as a nice side-effect, it becomes easier to mock things in tests.

import type { MessageHandler } from "../../types";
import { throwError, WUDSError } from "../../util/error";
import env from "./env";

const send: MessageHandler<*> =
    (typeof process.send === "function" && process.send.bind(process)) ||
    throwError(new WUDSError("Seems like process.send is not a function: The wpDevServer should be started with child_process.fork()"));

export default {
    env,
    send,
};
