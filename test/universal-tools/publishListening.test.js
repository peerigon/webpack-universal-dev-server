import test from "ava";
import publishListening from "../../lib/universal-tools/publishListening";
import { TYPE_APP_SERVER_LISTENING } from "../../lib/util/messages";
import testProcessSend from "../helpers/testProcessSend";

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

test("should call process.send with the correct host and port when the 'listening' event fires", t => {
    const host = "127.0.0.1";
    const port = 8080;
    const server = {
        address() {
            return {
                address: host,
                port
            };
        },
        on(arg1, arg2) {
            listener = arg2;
        }
    };
    let listener;

    publishListening(server);

    const [message] = testProcessSend(listener);

    t.deepEqual(message, {
        type: TYPE_APP_SERVER_LISTENING,
        host,
        port
    });
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
    let listener;

    publishListening(server);

    testProcessSend(listener, undefined);
});
