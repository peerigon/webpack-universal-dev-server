import { EOL } from "os"; // We split the logs by EOL to make the snapshot tests OS independent.
import test from "ava";
import { WritableProcess, ReadableProcess } from "../helpers/fakeProcesses";
import wireWpDevServer from "../../lib/wire/wireWpDevServer";
import { wpCompilation, wpDone } from "../../lib/util/messages";

function noop() {}

test("should log a build started message when the wpDevServer process emitted a wpCompilation message", t => {
    const wpDevServer = new ReadableProcess();
    let receivedLog;

    wireWpDevServer({
        wpDevServer,
        process,
        log(log) {
            receivedLog = log;
        }
    });

    wpDevServer.emit("message", wpCompilation("test-publisher"));

    t.snapshot(receivedLog.split(EOL));
});

test("should log a build success message when the wpDevServer process emitted a wpDone message with hasErrors false", t => {
    const wpDevServer = new ReadableProcess();
    const fakeWpStats = {
        startTime: 1000, // fake timestamps, minimum precesion in milliseconds
        endTime: 2500,
        hasErrors() { return false; },
        hasWarnings: noop,
        toString: noop
    };
    let receivedLog;

    wireWpDevServer({
        wpDevServer,
        process,
        log(log) {
            receivedLog = log;
        }
    });

    wpDevServer.emit("message", wpDone("test-publisher", fakeWpStats));

    t.snapshot(receivedLog.split(EOL));
});

test("should log a build error message when the wpDevServer process emitted a wpDone message with an errorLog", t => {
    const wpDevServer = new ReadableProcess();
    const fakeWpStats = {
        hasErrors() { return true; },
        hasWarnings: noop,
        toString() {
            return "Module build failed";
        }
    };
    let receivedLog;

    wireWpDevServer({
        wpDevServer,
        process,
        log(log) {
            receivedLog = log;
        }
    });

    wpDevServer.emit("message", wpDone("test-publisher", fakeWpStats));

    t.snapshot(receivedLog.split(EOL));
});

test("should pipe stderr from wpDevServer to process", async t => {
    const wpDevServer = new ReadableProcess();
    const process = new WritableProcess();

    wireWpDevServer({
        wpDevServer,
        process,
        log: noop
    });

    await new Promise((resolve, reject) => {
        wpDevServer.stderr.on("readable", resolve);
        wpDevServer.stderr.put("test", "utf8");
        wpDevServer.stderr.stop();
    });

    t.is(process.stderr.getContentsAsString("utf8"), "test");
});
