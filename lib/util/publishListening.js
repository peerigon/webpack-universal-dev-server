// @flow

import type { Server as HttpServer } from "http";
import type { Server as HttpsServer } from "https";
import { appServerListening } from "./messages";

type Server = HttpServer | HttpsServer;

export default function publishListening(server: Server) {
    function onListening() {
        const address = server.address();
        const bindType = typeof address === "string" ? "pipe" : "port";
        const send = process.send;

        if (typeof send === "function") {
            send.call(process, appServerListening(bindType, address));
        }
    }

    server.on("listening", onListening);
}
