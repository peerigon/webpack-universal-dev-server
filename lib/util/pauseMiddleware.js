// @flow

import type { MessageHandlers, NextExpressMiddleware, Request, Response } from "../types";
import { TYPE_WP_DEV_SERVER_PAUSE, TYPE_WP_DEV_SERVER_RESUME } from "../messages";
import handleMessages from "../messages/handleMessages";

let deferred: Array<NextExpressMiddleware> | null = null;
const handlePause = (
): void => {
    if (!deferred) {
        deferred = [];
    }
};
const handleResume = (
): void => {
    if (deferred) {
        void deferred.forEach(next => void next());
        deferred = null;
    }
};
const setupMessageHandlers = (
    handlers: MessageHandlers = new Map()
): void => {
    void handlers.set(TYPE_WP_DEV_SERVER_PAUSE, handlePause);
    void handlers.set(TYPE_WP_DEV_SERVER_RESUME, handleResume);
    void handleMessages(process, handlers);
};

export default (
    req: Request,
    res: Response,
    next: NextExpressMiddleware
): void =>
    void (deferred ? deferred.push(next) : next());

void setupMessageHandlers();
