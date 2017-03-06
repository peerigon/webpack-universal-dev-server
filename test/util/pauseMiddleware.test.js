import test from "ava"
import pauseMiddleware from "../../lib/util/pauseMiddleware"
import { wpDevServerPause, wpDevServerResume } from "../../lib/messages"

test("is inactive by default and just calls next", t => {
    const req = { url: "" }
    let called = false

    pauseMiddleware(
        req, null,
        () => (called = true)
    )
    t.is(called, true)
})

test(
    "queues all next functions when a WpDevServerPauseMessage is sent " +
    "and calls all next functions after the next tick when a WpDevServerResumeMessage is sent", t => {
    const req = { url: "" }
    const callOrder = []

    process.emit("message", wpDevServerPause())

    pauseMiddleware(req, null, () => callOrder.push("a"))
    pauseMiddleware(req, null, () => callOrder.push("b"))
    pauseMiddleware(req, null, () => callOrder.push("c"))

    t.is(callOrder.join(""), "")

    process.emit("message", wpDevServerResume())

    t.is(callOrder.join(""), "abc")
})

test("pauses and resumes correctly when emitted multiple times", t => {
    const req = { url: "" }
    const callOrder = []

    pauseMiddleware(req, null, () => callOrder.push("a"))
    process.emit("message", wpDevServerPause())
    t.is(callOrder.join(""), "a")

    pauseMiddleware(req, null, () => callOrder.push("b"))
    t.is(callOrder.join(""), "a")

    process.emit("message", wpDevServerResume())
    t.is(callOrder.join(""), "ab")

    pauseMiddleware(req, null, () => callOrder.push("c"))
    t.is(callOrder.join(""), "abc")

    process.emit("message", wpDevServerPause())
    pauseMiddleware(req, null, () => callOrder.push("d"))
    t.is(callOrder.join(""), "abc")

    process.emit("message", wpDevServerResume())
    t.is(callOrder.join(""), "abcd")

    process.emit("message", wpDevServerPause())
    t.is(callOrder.join(""), "abcd")

    pauseMiddleware(req, null, () => callOrder.push("e"))
    process.emit("message", wpDevServerResume())
    t.is(callOrder.join(""), "abcde")
})

test("ignores additional pause events without errors", t => {
    const req = { url: "" }
    const callOrder = []

    pauseMiddleware(req, null, () => callOrder.push("a"))
    process.emit("message", wpDevServerPause())
    process.emit("message", wpDevServerPause())
    process.emit("message", wpDevServerPause())
    t.is(callOrder.join(""), "a")

    pauseMiddleware(req, null, () => callOrder.push("b"))
    t.is(callOrder.join(""), "a")

    process.emit("message", wpDevServerResume())
    t.is(callOrder.join(""), "ab")
})

test("ignores additional resume events without errors", t => {
    const req = { url: "" }
    const callOrder = []

    process.emit("message", wpDevServerResume())
    process.emit("message", wpDevServerResume())
    process.emit("message", wpDevServerResume())
    pauseMiddleware(req, null, () => callOrder.push("a"))
    t.is(callOrder.join(""), "a")

    process.emit("message", wpDevServerPause())
    pauseMiddleware(req, null, () => callOrder.push("b"))
    t.is(callOrder.join(""), "a")

    process.emit("message", wpDevServerResume())
    process.emit("message", wpDevServerResume())
    process.emit("message", wpDevServerResume())
    t.is(callOrder.join(""), "ab")
})
