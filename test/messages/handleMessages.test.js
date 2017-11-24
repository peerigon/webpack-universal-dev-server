import test from "ava";
import handleMessages from "../../lib/messages/handleMessages";

test("should register a listener for a 'message' event", t => {
    const registration = [];
    const process = {
        on(event, listener) {
            registration.push(event, listener);
        },
    };

    handleMessages(process, new Map());

    const [event, listener] = registration;

    t.is(event, "message");
    t.is(typeof listener, "function");
});

test("should call the handler for a message type with the given message", t => {
    const process = {
        on(arg1, arg2) {
            listener = arg2;
        },
    };
    const message = {
        type: "hello",
    };
    const handlers = new Map();
    let listener;

    t.plan(1);

    handlers.set(message.type, arg => t.is(message, arg));

    handleMessages(process, handlers);

    // Manually emit the event
    listener(message);
});

test("should not call a handler if the message type does not match", t => {
    const process = {
        on(arg1, arg2) {
            listener = arg2;
        },
    };
    const message = {
        type: "hello",
    };
    const handlers = new Map();
    let listener;

    handlers.set("bye", () => t.fail("Should not be called"));

    handleMessages(process, handlers);

    listener(message);
});

test("should not throw if no message is passed at all", t => {
    const process = {
        on(arg1, arg2) {
            listener = arg2;
        },
    };
    let listener;

    handleMessages(process, new Map());

    listener();
});
