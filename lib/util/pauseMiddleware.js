// @flow

import type { Message, Request, Response } from "../types";
import { TYPE_WDS_PAUSE, TYPE_WDS_RESUME } from "./messages";
import Deferred from "./Deferred";

const handlers: Map<string, Function> = new Map();
let deferred: Deferred | null = null;

function onMessage(message: Message) {
    const handler = message && message.type && handlers.get(message.type);

    handler && handler(message);
}

export default function pauseMiddleware(req: Request, res: Response, next: Function) {
    if (!deferred) {
        next();
        return;
    }
    deferred.promise.then(next, next);
}

handlers.set(TYPE_WDS_PAUSE, () => {
    if (!deferred) {
        deferred = new Deferred();
    }
});

handlers.set(TYPE_WDS_RESUME, () => {
    deferred && deferred.resolve();
    deferred = null;
});

process.on("message", onMessage);
