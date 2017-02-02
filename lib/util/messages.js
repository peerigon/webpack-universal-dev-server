// @flow

import type { Message, SocketAddress, BindType, WebpackStats } from "../types";

export const TYPE_WP_DEV_SERVER_PAUSE = "WP_DEV_SERVER/PAUSE";
export const TYPE_WP_DEV_SERVER_RESUME = "WP_DEV_SERVER/RESUME";
export const TYPE_WP_COMPILATION = "WP/COMPILATION";
export const TYPE_WP_DONE = "WP/DONE";
export const TYPE_APP_SERVER_LISTENING = "APP_SERVER/LISTENING";

export function wpDevServerPause(): Message {
    return {
        type: TYPE_WP_DEV_SERVER_PAUSE
    };
}

export function wpDevServerResume(): Message {
    return {
        type: TYPE_WP_DEV_SERVER_RESUME
    };
}

export function wpCompilation(publisher: string): Message {
    return {
        type: TYPE_WP_COMPILATION,
        publisher
    };
}

export function wpDone(publisher: string, stats: WebpackStats): Message {
    return {
        type: TYPE_WP_DONE,
        publisher,
        duration: stats.endTime - stats.startTime,
        hasErrors: stats.hasErrors(),
        hasWarnings: stats.hasWarnings(),
        errorLog: stats.toString("errors-only")
    };
}

export function appServerListening(bindType: BindType, address: SocketAddress): Message {
    return {
        type: TYPE_APP_SERVER_LISTENING,
        bindType,
        address
    };
}
