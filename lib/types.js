// @flow

import type flow from "flow";

export type Process = flow.Process;

export type ChildProcess = flow.ChildProcess;

export type Message = {
    +type: string;
};

export type WpDevServerPauseMessage = Message;

export type WpDevServerResumeMessage = Message;

export type WpCompilationMessage = Message & {
    +publisher: string
};

export type WpDoneMessage = Message & {
    +publisher: string,
    +duration: number,
    +hasErrors: boolean,
    +hasWarnings: boolean,
    +errorLog: string
};

export type AppServerListeningMessage = Message & {
    +port: number,
    +host?: string // defaults to localhost
};

export type MessageHandler<M> = (message: M) => void;

// A publisher is a message handler that handles status reports messages.
// These functions are used in the child process to inform the main process.
export type PublishHandler =
    MessageHandler<WpCompilationMessage> |
    MessageHandler<WpDoneMessage> |
    MessageHandler<AppServerListeningMessage>;

export type MessageHandlers = Map<string, MessageHandler<*>>;

export type LogHandler = (log: string) => void;

export type ChildProcessFactory = () => ChildProcess;

export type Request = {};

export type Response = {};

export type ExpressMiddleware = (req: Request, req: Response, next: Function) => void

export type ExpressApp = {
    +use: (middleware: ExpressMiddleware) => void
};

export type WebpackOptions = {
    +plugins?: Array<any>,
    +devServer?: {
        setup: (app: ExpressApp) => void
    }
};

export type WebpackStats = {
    +startTime: number,
    +endTime: number,
    +hasErrors: () => boolean,
    +hasWarnings: () => boolean,
    +toString: (format: string) => string
};

export type WebpackCompiler = {
    +options: WebpackOptions,
    +plugin: (hook: string, fn: Function) => void
};

export type WebpackDevServerSetupHandler = (app: ExpressApp) => any;
