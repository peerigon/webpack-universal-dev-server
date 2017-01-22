import test from "ava";
import Deferred from "../../lib/util/Deferred";

test("should be creatable without arguments", t => {
    t.notThrows(() => new Deferred());
});

test("should have a `promise` property", t => {
    const deferred = new Deferred();

    t.truthy(deferred.promise instanceof Promise);
});

test("should have a `resolve` function", t => {
    const deferred = new Deferred();

    t.is(typeof deferred.resolve, "function");
});

test("should `resolve` promise when `resolve` has been called", async t => {
    const deferred = new Deferred();
    const ref = {};

    setImmediate(deferred.resolve, ref);

    t.is(await deferred.promise, ref);
});

test("should have a `reject` function", t => {
    const deferred = new Deferred();

    t.is(typeof deferred.reject, "function");
});

test("should `reject` promise when `reject` has been called", async t => {
    const deferred = new Deferred();
    const ref = {};

    setImmediate(deferred.reject, ref);

    try {
        await deferred.promise;
    } catch (err) {
        t.is(err, ref);
        return;
    }
    t.fail("Deferred has been resolved instead of reject");
});
