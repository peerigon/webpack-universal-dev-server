import test from "ava";
import publishListening from "../../lib/util/publishListening";
import { appServerListening } from "../../lib/util/messages";

test("should register a 'listening' event handler", t => {
    const server = {
        on(arg1, arg2) {
            event = arg1;
            listener = arg2;
        }
    };
    let event;
    let listener;

    publishListening(server);

    t.is(event, "listening");
    t.is(typeof listener, "function");
});

test("should call process.send when the 'listening' event fires", t => {
    const server = {
        address() {},
        on(arg1, arg2) {
            listener = arg2;
        }
    };
    const send = process.send;
    let called = false;
    let listener;

    process.send = () => called = true;

    publishListening(server);
    listener();

    t.truthy(called);

    process.send = send;
});

test("should call process.send with the correct port when the 'listening' event fires", t => {
    const port = 8080;
    const server = {
        address() {
            return port;
        },
        on(arg1, arg2) {
            listener = arg2;
        }
    };
    const send = process.send;
    let message;
    let listener;

    process.send = arg => message = arg;

    publishListening(server);
    listener();

    t.deepEqual(message, appServerListening("port", server.address()));

    process.send = send;
});

test("should call process.send with the correct pipe when the 'listening' event fires", t => {
    const pipe = "/some/pipe";
    const server = {
        address() {
            return pipe;
        },
        on(arg1, arg2) {
            listener = arg2;
        }
    };
    const send = process.send;
    let message;
    let listener;

    process.send = arg => message = arg;

    publishListening(server);
    listener();

    t.deepEqual(message, appServerListening("pipe", server.address()));

    process.send = send;
});

test("should not throw if process.send is undefined", t => {
    const port = 8080;
    const server = {
        address() {
            return port;
        },
        on(arg1, arg2) {
            listener = arg2;
        }
    };
    const send = process.send;
    let listener;

    delete process.send;

    publishListening(server);
    listener();

    process.send = send;
});
