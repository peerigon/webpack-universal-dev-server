import { EOL } from "os"; // We split the logs by EOL to make the snapshot tests OS independent.
import test from "ava";
import { WritableProcess, ReadableProcess } from "../helpers/fakeProcesses";
import wireAppServer from "../../lib/wire/appServer";
import { appServerListening, wpDevServerResume } from "../../lib/util/messages";

function noop() {}

test("should send a 'resume' message to the webpack-dev-server when the app server published a 'listening' message", t => {
    const appServer = new ReadableProcess();
    let receivedMessage;

    wireAppServer({
        appServer,
        process,
        sendToWpDevServer(message) {
            receivedMessage = message;
        },
        log: noop
    });

    appServer.emit("message", appServerListening("port", {
        address: "localhost",
        port: "8080"
    }));

    t.deepEqual(receivedMessage, wpDevServerResume());
});

test("should log the received 'listening' message (port address)", t => {
    const appServer = new ReadableProcess();
    let receivedLog;

    wireAppServer({
        appServer,
        process,
        sendToWpDevServer: noop,
        log(log) {
            receivedLog = log;
        }
    });

    appServer.emit("message", appServerListening("port", {
        address: "localhost",
        port: "8080"
    }));

    t.snapshot(receivedLog.split(EOL));
});

test("should log the received 'listening' message (pipe address)", t => {
    const appServer = new ReadableProcess();
    let receivedLog;

    wireAppServer({
        appServer,
        process,
        sendToWpDevServer: noop,
        log(log) {
            receivedLog = log;
        }
    });

    appServer.emit("message", appServerListening("pipe", "path/to/pipe"));

    t.snapshot(receivedLog.split(EOL));
});

test("should pipe stdout and stderr from appServer to process", async t => {
    const appServer = new ReadableProcess();
    const process = new WritableProcess();

    wireAppServer({
        appServer,
        process,
        log: noop,
        sendToWpDevServer: noop
    });

    await new Promise((resolve, reject) => {
        appServer.stderr.on("readable", resolve);
        appServer.stdout.put("test", "utf8");
        appServer.stderr.put("test", "utf8");
        appServer.stdout.stop();
        appServer.stderr.stop();
    });

    t.is(process.stdout.getContentsAsString("utf8"), "test");
    t.is(process.stderr.getContentsAsString("utf8"), "test");
});
