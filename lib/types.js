// @flow

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
    +bindType: string,
    +address: SocketAddress
};

export type MessageHandler<M> = (message: M) => void;

export type MessageHandlers = Map<string, MessageHandler<*>>;

export type Request = {};

export type Response = {};

export type ExpressApp = {
    +use: (req: Request, req: Response, next: Function) => void
};

export type SocketAddress = {
    +address: string,
    +family: string,
    +port: number
};

export type BindType = "port" | "pipe";

export type WebpackOptions = {
    +devServer: {
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

export type PublishBuildStatusPluginOptions = {
    +publisher: string,
    +publish: (message: Message) => void
};
