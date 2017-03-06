// @flow

import type { Process, Message, MessageHandler, MessageHandlers } from "../types"

type ProcessMessage = Message | any
type ProcessMessageHandler = MessageHandler<ProcessMessage>

const passMessage = (
    message: ProcessMessage,
    handler?: ProcessMessageHandler
): void =>
    void (
        handler && handler(message)
    )

const isValidMessage = (
    message
): boolean =>
    message && typeof message.type === "string"

const handleProcessMessage = (
    process: Process,
    handlers: MessageHandlers
) => (
    message: ProcessMessage
): void =>
    void (
        isValidMessage(message) &&
        passMessage(
            message,
            handlers.get(message.type)
        )
    )

export default (
    process: Process,
    handlers: MessageHandlers
): void =>
    void (
        process.on("message", handleProcessMessage(process, handlers))
    )
