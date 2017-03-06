// @flow

import type {
    WpDevServerPauseMessage, WpDevServerResumeMessage,
    WpCompilationMessage, WpDoneMessage,
    WebpackStats
} from "../types"

export const TYPE_WP_DEV_SERVER_PAUSE = "WP_DEV_SERVER/PAUSE"
export const TYPE_WP_DEV_SERVER_RESUME = "WP_DEV_SERVER/RESUME"
export const TYPE_WP_COMPILATION = "WP/COMPILATION"
export const TYPE_WP_DONE = "WP/DONE"
export const TYPE_APP_SERVER_LISTENING = "APP_SERVER/LISTENING"

export const wpDevServerPause = (
): WpDevServerPauseMessage =>
    ({
        type: TYPE_WP_DEV_SERVER_PAUSE
    })

export const wpDevServerResume = (
): WpDevServerResumeMessage =>
    ({
        type: TYPE_WP_DEV_SERVER_RESUME
    })

export const wpCompilation = (
    publisher: string
): WpCompilationMessage =>
    ({
        type: TYPE_WP_COMPILATION,
        publisher
    })

export const wpDone = (
    publisher: string,
    stats: WebpackStats
): WpDoneMessage =>
    ({
        type: TYPE_WP_DONE,
        publisher,
        duration: stats.endTime - stats.startTime,
        hasErrors: stats.hasErrors(),
        hasWarnings: stats.hasWarnings(),
        errorLog: stats.toString("errors-only")
    })

// appServerListening message is not defined here because the message is created by the application itself
// See also our webpack-universal-tools library
