// @flow

import type {
    Process, ChildProcess,
    LogHandler, WpDoneMessage
} from "../types";
import handleMessages from "../messages/handleMessages";
import { buildStarted, buildSuccess, buildError } from "../messages/logMessages";
import { TYPE_WP_COMPILATION, TYPE_WP_DONE } from "../messages";

type WireWpDevServerArgs = {
    +wpDevServer: ChildProcess,
    +process: Process,
    +log: LogHandler
};

const wpClientBuild = "webpack client build";

export default function wireWpDevServer({
        wpDevServer,
        process,
        log
    }: WireWpDevServerArgs): void {
    const messageHandlers = new Map();

    messageHandlers.set(TYPE_WP_COMPILATION, () => {
        log(buildStarted(wpClientBuild));
    });
    messageHandlers.set(TYPE_WP_DONE, (message: WpDoneMessage) => {
        if (message.errorLog) {
            log(buildError(wpClientBuild, message.errorLog));
        } else if (!message.hasErrors) {
            log(buildSuccess(wpClientBuild, message.duration));
        }
    });

    handleMessages(wpDevServer, messageHandlers);

    // Webpack errors won't be reported to stderr. This is just for hard failures.
    wpDevServer.stderr && wpDevServer.stderr.pipe(process.stderr);
}
