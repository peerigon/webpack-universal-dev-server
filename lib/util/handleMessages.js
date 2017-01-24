// @flow

import type { Process } from "flow";
import type { Message, MessageHandlers } from "../types";

type ProcessMessage = Message | any;

export default function handleMessages(process: Process, handlers: MessageHandlers) {
    process.on("message", (message: ?ProcessMessage) => {
        if (message && typeof message.type === "string") {
            const handler = handlers.get(message.type);

            handler && handler(message);
        }
    });
}
