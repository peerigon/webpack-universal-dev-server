// @flow

import type { MessageHandlers, Request, Response } from "../types"
import { TYPE_WP_DEV_SERVER_PAUSE, TYPE_WP_DEV_SERVER_RESUME } from "../messages"
import handleMessages from "../messages/handleMessages"

type Next = () => void

let deferred: Array<Next> | null = null

const call = (
    next: Next
): void =>
    void (
        next()
    )

const handlePause = (
): void =>
    void (
        !deferred && (deferred = [])
    )

const handleResume = (
): void =>
    void (
        deferred && deferred.forEach(call),
        (deferred = null)
    )

const setupMessageHandlers = (
    handlers: MessageHandlers = new Map()
): void =>
    void (
        handlers.set(TYPE_WP_DEV_SERVER_PAUSE, handlePause),
        handlers.set(TYPE_WP_DEV_SERVER_RESUME, handleResume),
        handleMessages(process, handlers)
    )

export default (
    req: Request,
    res: Response,
    next: Next
): void =>
    void (
        deferred ? deferred.push(next) : next()
    )

setupMessageHandlers()
