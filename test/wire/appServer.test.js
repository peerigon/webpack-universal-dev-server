import test from "ava";
import wireAppServer from "../../lib/wire/appServer";
import { TYPE_APP_SERVER_LISTENING, wpDevServerResume } from "../../lib/messages";
import { WritableProcess, ReadableProcess } from "../helpers/fakeProcesses";
import normalizeLog from "../helpers/normalizeLog";

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

    appServer.emit("message", {
        type: TYPE_APP_SERVER_LISTENING,
        port: 8080
    });

    t.deepEqual(receivedMessage, wpDevServerResume());
});

test("should log the received 'listening' message", t => {
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

    appServer.emit("message", {
        type: TYPE_APP_SERVER_LISTENING,
        host: "127.0.0.1",
        port: 8080
    });

    t.snapshot(normalizeLog(receivedLog));
});

test("should log the received 'listening' message (fallback localhost)", t => {
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

    appServer.emit("message", {
        type: TYPE_APP_SERVER_LISTENING,
        port: 8080
    });

    t.snapshot(normalizeLog(receivedLog));
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
