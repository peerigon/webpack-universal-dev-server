import test from "ava";
import wireWpWatchProcess from "../../lib/wire/wpWatchProcess";
import { wpCompilation, wpDone } from "../../lib/messages";
import { WritableProcess, ReadableProcess, SilentProcess } from "../helpers/fakeProcesses";
import normalizeLog from "../helpers/normalizeLog";

function noop() {}

test("should log a build started message when the wpWatchProcess emitted a wpCompilation message", t => {
    const wpWatchProcess = new ReadableProcess();
    let receivedLog;

    wireWpWatchProcess({
        wpWatchProcess,
        process,
        log(log) {
            receivedLog = log;
        }
    });

    wpWatchProcess.emit("message", wpCompilation("test-publisher"));

    t.snapshot(normalizeLog(receivedLog));
});

test("should log a build success message when the wpWatchProcess emitted a wpDone message with hasErrors false", t => {
    const wpWatchProcess = new ReadableProcess();
    const fakeWpStats = {
        startTime: 1000, // fake timestamps, minimum precesion in milliseconds
        endTime: 2500,
        hasErrors() { return false; },
        hasWarnings: noop,
        toString: noop
    };
    let receivedLog;

    wireWpWatchProcess({
        wpWatchProcess,
        process,
        forkAppServer: noop,
        log(log) {
            receivedLog = log;
        }
    });

    wpWatchProcess.emit("message", wpDone("test-publisher", fakeWpStats));

    t.snapshot(normalizeLog(receivedLog));
});

test("should call forkAppServer when the wpWatchProcess emitted a wpDone message with hasErrors false", t => {
    const wpWatchProcess = new ReadableProcess();
    const fakeWpStats = {
        hasErrors() { return false; },
        hasWarnings: noop,
        toString: noop
    };
    let called = false;

    wireWpWatchProcess({
        wpWatchProcess,
        process,
        forkAppServer() {
            called = true;
        },
        log: noop
    });

    wpWatchProcess.emit("message", wpDone("test-publisher", fakeWpStats));

    t.is(called, true);
});

test("should call kill on the appServer when the wpWatchProcess emitted a wpDone message with hasErrors false and then a wpCompilation message", t => {
    const wpWatchProcess = new ReadableProcess();
    const fakeWpStats = {
        hasErrors() { return false; },
        hasWarnings: noop,
        toString: noop
    };
    const appServer = new ReadableProcess();
    let called = false;

    wireWpWatchProcess({
        wpWatchProcess,
        process,
        forkAppServer() { return appServer; },
        log: noop
    });

    appServer.kill = function () {
        called = true;
    };

    wpWatchProcess.emit("message", wpDone("test-publisher", fakeWpStats));
    wpWatchProcess.emit("message", wpCompilation("test-publisher"));

    t.is(called, true);
});

test("should log a build error message when the wpWatchProcess emitted a wpDone message with an errorLog", t => {
    const wpWatchProcess = new ReadableProcess();
    const fakeWpStats = {
        hasErrors() { return true; },
        hasWarnings: noop,
        toString() {
            return "Module build failed";
        }
    };
    let receivedLog;

    wireWpWatchProcess({
        wpWatchProcess,
        process,
        log(log) {
            receivedLog = log;
        }
    });

    wpWatchProcess.emit("message", wpDone("test-publisher", fakeWpStats));

    t.snapshot(normalizeLog(receivedLog));
});

test("should pipe stderr from wpWatchProcess to process", async t => {
    const wpWatchProcess = new ReadableProcess();
    const process = new WritableProcess();

    wireWpWatchProcess({
        wpWatchProcess,
        process,
        log: noop
    });

    await new Promise((resolve, reject) => {
        wpWatchProcess.stderr.on("readable", resolve);
        wpWatchProcess.stderr.put("test", "utf8");
        wpWatchProcess.stderr.stop();
    });

    t.is(process.stderr.getContentsAsString("utf8"), "test");
});

test("should not throw if the wpWatchProcess is a silent process", t => {
    const wpWatchProcess = new SilentProcess();
    const process = new WritableProcess();

    wireWpWatchProcess({
        wpWatchProcess,
        process,
        log: noop
    });
});
