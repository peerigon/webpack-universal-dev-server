// @flow

import type { Server as HttpServer } from "http";
import type { Server as HttpsServer } from "https";
import { appServerListening } from "./messages";

type Server = HttpServer | HttpsServer;

export default function publishListening(server: Server) {
    function onListening() {
        const { port, address } = server.address();
        const send = process.send;

        if (typeof send === "function") {
            send.call(process, appServerListening(port, address));
        }
    }

    server.on("listening", onListening);
}
