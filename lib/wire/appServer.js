// @flow

import type { Process } from "flow";
import type { ChildProcess } from "child_process";
import type { WpDevServerResumeMessage, AppServerListeningMessage, MessageHandler, LogHandler } from "../types";
import handleMessages from "../messages/handleMessages";
import { TYPE_APP_SERVER_LISTENING, wpDevServerResume } from "../messages";

type WireAppServerArgs = {
    +appServer: ChildProcess,
    +process: Process,
    +sendToWpDevServer: MessageHandler<WpDevServerResumeMessage>,
    +log: LogHandler
};

export default function wireAppServer({
        appServer,
        process,
        sendToWpDevServer,
        log
    } : WireAppServerArgs): void {
    const messageHandlers = new Map();

    messageHandlers.set(TYPE_APP_SERVER_LISTENING, (message: AppServerListeningMessage) => {
        const host = message.host || "localhost";

        sendToWpDevServer(wpDevServerResume());
        log(`App server listening at ${ host }:${ String(message.port) }`);
    });

    handleMessages(appServer, messageHandlers);

    appServer.stdout.pipe(process.stdout);
    appServer.stderr.pipe(process.stderr);
}
