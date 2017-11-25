// @flow

import type { ChildProcess } from "child_process";
import type { LogHandler, WpDevServerResumeMessage } from "../types";
import forkAppServer from "../fork/appServer";
import forkWpDevServer from "../fork/wpDevServer";
import forkWpWatchProcess from "../fork/wpWatchProcess";
import wireAppServer from "../wire/appServer";
import wireWpDevServer from "../wire/wpDevServer";
import wireWpWatchProcess from "../wire/wpWatchProcess";

type Args = {
    +log?: LogHandler
};

const sendToWpDevServer = (
    wpDevServer: ChildProcess
) => (
    message: WpDevServerResumeMessage
): void => {
    void wpDevServer.send(message);
};
const forkAndWireAppServer = (
    wpDevServer: ChildProcess,
    log
) => (
    appServer = forkAppServer()
): ChildProcess => {
    void wireAppServer({
        appServer,
        process,
        sendToWpDevServer: sendToWpDevServer(wpDevServer),
        log,
    });

    return appServer;
};
const start = (
    log: LogHandler = console.log.bind(console),
    wpWatchProcess: ChildProcess = forkWpWatchProcess(),
    wpDevServer: ChildProcess = forkWpDevServer(),
): void => {
    void wireWpWatchProcess({
        wpWatchProcess,
        process,
        forkAppServer: forkAndWireAppServer(wpDevServer, log),
        log,
    });
    void wireWpDevServer({
        wpDevServer,
        process,
        log,
    });
};

export default ({
    log,
}: Args): void =>
    start(log);
