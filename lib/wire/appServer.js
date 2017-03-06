// @flow

import type {
    Process, ChildProcess,
    WpDevServerResumeMessage, AppServerListeningMessage,
    MessageHandler, MessageHandlers, LogHandler
} from "../types"
import handleMessages from "../messages/handleMessages"
import { TYPE_APP_SERVER_LISTENING, wpDevServerResume } from "../messages"

type SendToWpDevServer = MessageHandler<WpDevServerResumeMessage>

const handleAppServerListening = (
    sendToWpDevServer: SendToWpDevServer,
    log: LogHandler
) => (
    message: AppServerListeningMessage
): void =>
    void (
        sendToWpDevServer(wpDevServerResume()),
        log(`App server listening at ${ message.host || "localhost" }:${ String(message.port) }`)
    )

const setupMessageHandlers = (
    appServer: ChildProcess,
    handleAppServerListening,
    handlers: MessageHandlers = new Map()
): void =>
    void (
        handlers.set(TYPE_APP_SERVER_LISTENING, handleAppServerListening),
        handleMessages(appServer, handlers)
    )

type AppServerArgs = {
    +appServer: ChildProcess,
    +process: Process,
    +sendToWpDevServer: SendToWpDevServer,
    +log: LogHandler
}

export default ({
    appServer,
    process,
    sendToWpDevServer,
    log
}: AppServerArgs): void =>
    void (
        setupMessageHandlers(
            appServer,
            handleAppServerListening(sendToWpDevServer, log)
        ),
        appServer.stdout.pipe(process.stdout),
        appServer.stderr.pipe(process.stderr)
    )
