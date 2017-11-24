// @flow

import type { MessageHandlers, NextExpressMiddleware, Request, Response } from "../types";
import { TYPE_WP_DEV_SERVER_PAUSE, TYPE_WP_DEV_SERVER_RESUME } from "../messages";
import handleMessages from "../messages/handleMessages";

let deferred: Array<NextExpressMiddleware> | null = null;
const call = (
    next: NextExpressMiddleware
): void =>
    void (
        next()
    );
const handlePause = (
): void =>
    void (
        !deferred && (deferred = [])
    );
const handleResume = (
): void =>
    void (
        deferred && deferred.forEach(call),
        (deferred = null)
    );
const setupMessageHandlers = (
    handlers: MessageHandlers = new Map()
): void =>
    void (
        handlers.set(TYPE_WP_DEV_SERVER_PAUSE, handlePause),
        handlers.set(TYPE_WP_DEV_SERVER_RESUME, handleResume),
        handleMessages(process, handlers)
    );

export default (
    req: Request,
    res: Response,
    next: NextExpressMiddleware
): void =>
    void (
        deferred ? deferred.push(next) : next()
    );

setupMessageHandlers();
