// @flow

import type { Server as HttpServer } from "http";
import type { Server as HttpsServer } from "https";
import { asListening } from "./messages";

type Server = HttpServer | HttpsServer;

const send = typeof process.send === "function" ? process.send.bind(process) : () => {};

export default function publishListening(server: Server) {
    function onListening() {
        const address = server.address();
        const bindType = typeof address === "string" ? "pipe" : "port";

        send(asListening(bindType, address));
    }

    server.on("listening", onListening);
}
