// @flow

export type Message = {
    type: string;
};

export type Request = {};

export type Response = {};

export type ExpressApp = {
    use: (req: Request, req: Response, next: Function) => void
};

export type WebpackOptions = {
    devServer: {
        setup: (app: ExpressApp) => void
    }
};

export type WebpackStats = {
    startTime: number,
    endTime: number,
    hasErrors: () => boolean,
    hasWarnings: () => boolean,
    toString: (format: string) => string
};

export type WebpackCompiler = {
    options: WebpackOptions,
    plugin: (hook: string, fn: Function) => void
};

export type PublishBuildStatusPluginOptions = {
    publisher: string,
    publish: (message: Message) => void
};
