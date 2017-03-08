// @flow

import type { ChildProcess } from "child_process"

export type Message = {
    +type: string
}

export type WpDevServerPauseMessage = {
    +type: "WP_DEV_SERVER/PAUSE"
}

export type WpDevServerResumeMessage = {
    +type: "WP_DEV_SERVER/RESUME"
}

export type WpCompilationMessage = {
    +type: "WP/COMPILATION",
    +publisher: string
}

export type WpDoneMessage = {
    +type: "WP/DONE",
    +publisher: string,
    +duration: number,
    +hasErrors: boolean,
    +hasWarnings: boolean,
    +errorLog: string
}

export type AppServerListeningMessage = {
    +type: "APP_SERVER/LISTENING",
    +port: number,
    +host?: string // defaults to localhost
}

export type Noop = () => void

export type MessageHandler<M> = (message: M) => void

export type WpDevServerMessageHandler = MessageHandler<WpDevServerPauseMessage | WpDevServerResumeMessage>

export type WpMessageHandler = MessageHandler<WpCompilationMessage | WpDoneMessage>

export type AppServerMessageHandler = MessageHandler<AppServerListeningMessage>

export type MessageHandlers = Map<string, MessageHandler<*>>

export type LogHandler = (log: string) => void

export type ChildProcessFactory = () => ChildProcess

export type Request = {}

export type Response = {}

export type NextExpressMiddleware = (err?: Error) => void

export type ExpressMiddleware = (req: Request, req: Response, next: NextExpressMiddleware) => void

export type ExpressApp = {
    +use: (middleware: ExpressMiddleware) => void
}

export type WebpackDevServerOptions = {
    setup?: (app: ExpressApp) => void
}

export type WebpackOptions = {
    plugins?: Array<*>,
    devServer?: WebpackDevServerOptions
}

export type PromisedWebpackOptions = Promise<WebpackOptions>

export type WebpackConfigGetterArgs = Array<*>

export type WebpackConfigGetter = (...args: WebpackConfigGetterArgs) => (WebpackOptions | PromisedWebpackOptions)

export type WebpackConfigExport = WebpackConfigGetter | {
    +default: WebpackConfigGetter
}

export type WebpackStats = {
    +startTime: number,
    +endTime: number,
    +hasErrors: () => boolean,
    +hasWarnings: () => boolean,
    +toString: (format: string) => string
}

export type WebpackCompiler = {
    +options: WebpackOptions,
    +plugin: (hook: string, fn: (...args: Array<*>) => void) => void
}

export type WebpackDevServerSetupHandler<ReturnType> = (app: ExpressApp) => ReturnType
