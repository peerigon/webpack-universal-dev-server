// @flow

import type { Process } from "flow";
import type { ChildProcess } from "child_process";
import type { Logger, WpDoneMessage } from "../types";
import handleMessages from "../util/handleMessages";
import { buildStarted, buildSuccess, buildError } from "../util/logMessages";
import { TYPE_WP_COMPILATION, TYPE_WP_DONE } from "../util/messages";

type WireWpDevServerArgs = {
    +wpDevServer: ChildProcess,
    +process: Process,
    +log: Logger
};

export default function wireWpDevServer({
        wpDevServer,
        process,
        log
    } : WireWpDevServerArgs): void {
    const messageHandlers = new Map();

    messageHandlers.set(TYPE_WP_COMPILATION, () => {
        log(buildStarted("webpack client build"));
    });
    messageHandlers.set(TYPE_WP_DONE, (message: WpDoneMessage) => {
        if (message.errorLog) {
            log(buildError("webpack client build", message.errorLog));
        } else if (!message.hasErrors) {
            log(buildSuccess("webpack client build", message.duration));
        }
    });

    handleMessages(wpDevServer, messageHandlers);

    // Webpack errors won't reported to stderr. This is just for hard failures.
    wpDevServer.stderr.pipe(process.stderr);
}
