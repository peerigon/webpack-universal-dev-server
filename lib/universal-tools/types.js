// @flow

export type Message = {
    +type: string;
};

export type AppServerListeningMessage = Message & {
    +port: number,
    +host: string // defaults to localhost
};
