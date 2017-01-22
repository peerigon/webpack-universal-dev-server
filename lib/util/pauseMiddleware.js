// @flow

import type { Message } from "./messages";
import { TYPE_PAUSE, TYPE_RESUME } from "./messages";
import Deferred from "./Deferred";

type Request = {};
type Response = {};

const handlers: Map<string, Function> = new Map();
let deferred: Deferred | null = null;

function onMessage(message: Message) {
    const handler = message && message.type && handlers.get(message.type);

    handler && handler(message);
}

handlers.set(TYPE_PAUSE, () => {
    if (!deferred) {
        deferred = new Deferred();
    }
});
handlers.set(TYPE_RESUME, () => {
    deferred && deferred.resolve();
    deferred = null;
});

export default function pauseMiddleware(req: Request, res: Response, next: Function) {
    if (!deferred) {
        next();
        return;
    }
    deferred.promise.then(next, next);
}

pauseMiddleware.enable = function () {
    process.on("message", onMessage);
};

pauseMiddleware.disable = function () {
    process.removeListener("message", onMessage);
};
