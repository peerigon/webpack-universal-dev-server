import test from "ava"
import wireWpDevServer from "../../lib/wire/wpDevServer"
import { wpCompilation, wpDone } from "../../lib/messages"
import { WritableProcess, ReadableProcess, SilentProcess } from "../helpers/fakeProcesses"
import normalizeLog from "../helpers/normalizeLog"

function noop() {}

test("should log a build started message when the wpDevServer process emitted a wpCompilation message", t => {
    const wpDevServer = new ReadableProcess()
    let receivedLog

    wireWpDevServer({
        wpDevServer,
        process,
        log(log) {
            receivedLog = log
        }
    })

    wpDevServer.emit("message", wpCompilation("test-publisher"))

    t.snapshot(normalizeLog(receivedLog))
})

test("should log a build success message when the wpDevServer process emitted a wpDone message with hasErrors false", t => {
    const wpDevServer = new ReadableProcess()
    const fakeWpStats = {
        startTime: 1000, // fake timestamps, minimum precision in milliseconds
        endTime: 2500,
        hasErrors: () => false,
        hasWarnings: noop,
        toString: noop
    }
    let receivedLog

    wireWpDevServer({
        wpDevServer,
        process,
        log(log) {
            receivedLog = log
        }
    })

    wpDevServer.emit("message", wpDone("test-publisher", fakeWpStats))

    t.snapshot(normalizeLog(receivedLog))
})

test("should log a build error message when the wpDevServer process emitted a wpDone message with an errorLog", t => {
    const wpDevServer = new ReadableProcess()
    const fakeWpStats = {
        hasErrors: () => true,
        hasWarnings: noop,
        toString: () => "Module build failed"
    }
    let receivedLog

    wireWpDevServer({
        wpDevServer,
        process,
        log(log) {
            receivedLog = log
        }
    })

    wpDevServer.emit("message", wpDone("test-publisher", fakeWpStats))

    t.snapshot(normalizeLog(receivedLog))
})

test("should pipe stderr from wpDevServer to process", async t => {
    const wpDevServer = new ReadableProcess()
    const process = new WritableProcess()

    wireWpDevServer({
        wpDevServer,
        process,
        log: noop
    })

    await new Promise((resolve, reject) => {
        wpDevServer.stderr.on("readable", resolve)
        wpDevServer.stderr.put("test", "utf8")
        wpDevServer.stderr.stop()
    })

    t.is(process.stderr.getContentsAsString("utf8"), "test")
})

test("should not throw if the wpDevServer is a silent process", t => {
    const wpDevServer = new SilentProcess()
    const process = new WritableProcess()

    wireWpDevServer({
        wpDevServer,
        process,
        log: noop
    })
})
