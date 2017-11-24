// @flow

import type { ChildProcess } from "child_process";
import type {
    ChildProcessFactory,
    WpDoneMessage,
    MessageHandlers, LogHandler,
} from "../types";
import handleMessages from "../messages/handleMessages";
import { buildStarted, buildSuccess, buildError } from "../messages/logMessages";
import { TYPE_WP_COMPILATION, TYPE_WP_DONE } from "../messages";

const wpServerBuild = "webpack server build";
let appServer;
const handleWpCompilation = (
    log: LogHandler
) => (
): void =>
    void (
        log(buildStarted(wpServerBuild)),
        appServer && appServer.kill()
    );
const handleWpDone = (
    forkAppServer: ChildProcessFactory,
    log: LogHandler
) => (
    message: WpDoneMessage
): void =>
    void (
        message.hasErrors ? (
            log(buildError(wpServerBuild, message.errorLog))
        ) : (
            log(buildSuccess(wpServerBuild, message.duration)),
            (appServer = forkAppServer())
        )
    );
const setupMessageHandlers = (
    wpWatchProcess: ChildProcess,
    forkAppServer: ChildProcessFactory,
    log: LogHandler,
    handlers: MessageHandlers = new Map()
): void =>
    void (
        handlers.set(TYPE_WP_COMPILATION, handleWpCompilation(log)),
        handlers.set(TYPE_WP_DONE, handleWpDone(forkAppServer, log)),
        handleMessages(wpWatchProcess, handlers)
    );

type WpWatchProcessArgs = {
    +wpWatchProcess: ChildProcess,
    +process: Process,
    +forkAppServer: ChildProcessFactory,
    +log: LogHandler
};

export default ({
    wpWatchProcess,
    process,
    forkAppServer,
    log,
}: WpWatchProcessArgs): void =>
    void (
        setupMessageHandlers(wpWatchProcess, forkAppServer, log),
        // Webpack errors won't be reported to stderr. This is just for hard failures.
        wpWatchProcess.stderr && wpWatchProcess.stderr.pipe(process.stderr)
    );
