// @flow

import type { ChildProcess } from "child_process";
import type { Message, MessageHandler, MessageHandlers } from "../types";

type ProcessLike = Process | ChildProcess;
type ProcessMessage = Message;
type ProcessMessageHandler = MessageHandler<ProcessMessage>;

const passMessage = (
    message: ProcessMessage,
    handler?: ProcessMessageHandler
): void => {
    if (handler) {
        void handler(message);
    }
};
const isValidMessage = (
    message
): boolean =>
    message && typeof message.type === "string";
const handleProcessMessage = (
    process: ProcessLike,
    handlers: MessageHandlers
) => (
    message: ProcessMessage
): void => {
    if (isValidMessage(message)) {
        void passMessage(
            message,
            handlers.get(message.type)
        );
    }
};

export default (
    process: ProcessLike,
    handlers: MessageHandlers
): void => {
    void process.on("message", handleProcessMessage(process, handlers));
};
