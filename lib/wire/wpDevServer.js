// @flow

import type { ChildProcess } from "child_process"
import type {
    WpDoneMessage,
    MessageHandlers, LogHandler
} from "../types"
import handleMessages from "../messages/handleMessages"
import { buildStarted, buildSuccess, buildError } from "../messages/logMessages"
import { TYPE_WP_COMPILATION, TYPE_WP_DONE } from "../messages"

const wpClientBuild = "webpack client build"

const handleWpCompilation = (
    log: LogHandler
) => (
): void =>
    void (
        log(buildStarted(wpClientBuild))
    )

const handleWpDone = (
    log: LogHandler
) => (
    message: WpDoneMessage
): void =>
    void (
        message.errorLog && log(buildError(wpClientBuild, message.errorLog)),
        Boolean(message.hasErrors) === false && log(buildSuccess(wpClientBuild, message.duration))
    )

const setupMessageHandlers = (
    wpDevServer: ChildProcess,
    log: LogHandler,
    handlers: MessageHandlers = new Map()
): void =>
    void (
        handlers.set(TYPE_WP_COMPILATION, handleWpCompilation(log)),
        handlers.set(TYPE_WP_DONE, handleWpDone(log)),
        handleMessages(wpDevServer, handlers)
    )

type WpDevServerArgs = {
    +wpDevServer: ChildProcess,
    +process: Process,
    +log: LogHandler
}

export default ({
    wpDevServer,
    process,
    log
}: WpDevServerArgs): void =>
    void (
        setupMessageHandlers(wpDevServer, log),
        // Webpack errors won't be reported to stderr. This is just for hard failures.
        wpDevServer.stderr && wpDevServer.stderr.pipe(process.stderr)
    )
