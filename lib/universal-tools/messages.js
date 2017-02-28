// @flow

import type {
    AppServerListeningMessage
} from "./types";

export const TYPE_APP_SERVER_LISTENING = "APP_SERVER/LISTENING";

export function appServerListening(port: number, host?: string = "localhost"): AppServerListeningMessage {
    return {
        type: TYPE_APP_SERVER_LISTENING,
        port,
        host
    };
}
