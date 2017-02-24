// @flow

import type { WpDevServerResumeMessage } from "../types";
import forkAppServer from "../fork/appServer";
import forkWpDevServer from "../fork/wpDevServer";
import forkWpWatchProcess from "../fork/wpWatchProcess";
import wireAppServer from "../wire/appServer";
import wireWpDevServer from "../wire/wpDevServer";
import wireWpWatchProcess from "../wire/wpWatchProcess";

const wpWatchProcess = forkWpWatchProcess();
const wpDevServer = forkWpDevServer();
const log = console.log.bind(console);

function sendToWpDevServer(message: WpDevServerResumeMessage) {
    wpDevServer.send(message);
}

function forkAndWireAppServer() {
    const appServer = forkAppServer();

    wireAppServer({
        appServer,
        process,
        sendToWpDevServer,
        log
    });

    return appServer;
}

wireWpWatchProcess({
    wpWatchProcess,
    process,
    forkAppServer: forkAndWireAppServer,
    log
});

wireWpDevServer({
    wpDevServer,
    process,
    log
});
