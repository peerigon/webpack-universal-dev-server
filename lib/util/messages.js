// @flow

import type { Message, WebpackStats } from "../types";

const NAMESPACE = __filename;

// WDS = Webpack Dev Server (watches, compiles and serves the client bundle)
// WWP = Webpack Watch Process (watches and compiles the server bundle)
export const TYPE_WDS_PAUSE = `${ NAMESPACE }/WDS/PAUSE`;
export const TYPE_WDS_RESUME = `${ NAMESPACE }/WDS/RESUME`;
export const TYPE_WWP_COMPILATION = `${ NAMESPACE }/WWP/COMPILATION`;
export const TYPE_WWP_DONE = `${ NAMESPACE }/WWP/DONE`;

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
