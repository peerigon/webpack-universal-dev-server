// @flow

// This helper module encapsulates all property accesses to global properties inside the wpWatchProcess.
// This way, we document the outside API of this process.
// And as a nice side-effect, it becomes easier to mock things in tests.

import type { MessageHandler } from "../../types";
import { WUDSError } from "../../util/error";
import env from "./env";

if (typeof process.send !== "function") {
    throw new WUDSError("Seems like process.send is not a function: The wpWatchProcess should be started with child_process.fork()");
}

const send: MessageHandler<*> = process.send.bind(process);

export default {
    env,
    send,
};
