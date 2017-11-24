// @flow

import type { Server as HttpServer } from "http";
import type { Server as HttpsServer } from "https";
import { appServerListening } from "./messages";
import process from "./process";

type Server = HttpServer | HttpsServer;
type ServerAddress = {
    port: number,
    address: string
};

const sendAppServerListeningMessage = (
    { port, address }: ServerAddress
): void =>
    void (
        process.send(appServerListening(port, address))
    );
const handleListening = (
    server: Server
) => (
): void =>
    sendAppServerListeningMessage(server.address());

export default (
    server: Server
): void =>
    void (
        server.on("listening", handleListening(server))
    );
