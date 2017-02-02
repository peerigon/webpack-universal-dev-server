import test from "ava";
import pauseMiddleware from "../../lib/util/pauseMiddleware";
import { wpDevServerPause, wpDevServerResume } from "../../lib/util/messages";

test("is inactive by default and just calls next", t => {
    const req = { url: "" };
    let called = false;

    pauseMiddleware(
        req, null,
        () => (called = true)
    );
    t.is(called, true);
});

test("queues all next functions when a PauseMessage is sent " +
    "and calls all next functions after the next tick when a ContinueMessage is sent", async t => {
    const req = { url: "" };
    const callOrder = [];
    const oneTick = Promise.resolve();

    process.emit("message", wpDevServerPause());

    pauseMiddleware(req, null, () => callOrder.push("a"));
    pauseMiddleware(req, null, () => callOrder.push("b"));
    pauseMiddleware(req, null, () => callOrder.push("c"));

    t.is(callOrder.join(""), "");

    process.emit("message", wpDevServerResume());

    await oneTick;

    t.is(callOrder.join(""), "abc");
});
