// @flow

import type {
    AppServerListeningMessage,
} from "./types";

export const TYPE_APP_SERVER_LISTENING = "APP_SERVER/LISTENING";

export const appServerListening = (
    port: number,
    host: string = "localhost"
): AppServerListeningMessage =>
    ({
        type: TYPE_APP_SERVER_LISTENING,
        port,
        host,
    });
