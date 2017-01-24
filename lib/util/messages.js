// @flow

import type { Message, SocketAddress, BindType, WebpackStats } from "../types";

// WDS = Webpack Dev Server (watches, compiles and serves the client bundle)
// WWP = Webpack Watch Process (watches and compiles the server bundle)
// AS = Application Server (starts the actual https? server)
export const TYPE_WDS_PAUSE = "WDS/PAUSE";
export const TYPE_WDS_RESUME = "WDS/RESUME";
export const TYPE_WWP_COMPILATION = "WWP/COMPILATION";
export const TYPE_WWP_DONE = "WWP/DONE";
export const TYPE_AS_LISTENING = "AS/LISTENING";

export function wdsPause(): Message {
    return {
        type: TYPE_WDS_PAUSE
    };
}

export function wdsResume(): Message {
    return {
        type: TYPE_WDS_RESUME
    };
}

export function wwpCompilation(publisher: string): Message {
    return {
        type: TYPE_WWP_COMPILATION,
        publisher
    };
}

export function wwpDone(publisher: string, stats: WebpackStats): Message {
    return {
        type: TYPE_WWP_DONE,
        publisher,
        duration: stats.endTime - stats.startTime,
        hasErrors: stats.hasErrors(),
        hasWarnings: stats.hasWarnings(),
        errorLog: stats.toString("errors-only")
    };
}

export function asListening(bindType: BindType, address: SocketAddress): Message {
    return {
        type: TYPE_AS_LISTENING,
        bindType,
        address
    };
}
