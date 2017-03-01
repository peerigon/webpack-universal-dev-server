// @flow

import type { Process } from "flow";
import type { ChildProcess } from "child_process";
import type { Logger, Forker, WpDoneMessage } from "../types";
import handleMessages from "../messages/handleMessages";
import { buildStarted, buildSuccess, buildError } from "../messages/logMessages";
import { TYPE_WP_COMPILATION, TYPE_WP_DONE } from "../messages";

type wireWpWatchProcessArgs = {
    +wpWatchProcess: ChildProcess,
    +process: Process,
    +forkAppServer: Forker,
    +log: Logger
};

const wpServerBuild = "webpack server build";

export default function wireWpWatchProcess({
        wpWatchProcess,
        process,
        forkAppServer,
        log
    } : wireWpWatchProcessArgs): void {
    const messageHandlers = new Map();
    let appServer;

    messageHandlers.set(TYPE_WP_COMPILATION, () => {
        log(buildStarted(wpServerBuild));
        appServer && appServer.kill();
    });
    messageHandlers.set(TYPE_WP_DONE, (message: WpDoneMessage) => {
        if (message.errorLog) {
            log(buildError(wpServerBuild, message.errorLog));
        } else if (!message.hasErrors) {
            log(buildSuccess(wpServerBuild, message.duration));
            appServer = forkAppServer();
        }
    });

    handleMessages(wpWatchProcess, messageHandlers);

    // Webpack errors won't be reported to stderr. This is just for hard failures.
    wpWatchProcess.stderr && wpWatchProcess.stderr.pipe(process.stderr);
}
