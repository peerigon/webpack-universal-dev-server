"use strict";

require("babel-register"); // eslint-disable-line import/no-unassigned-import

const assert = require("assert");
const EventEmitter = require("events");

const server = new EventEmitter();
const address = {
    port: 1337,
    address: "127.0.0.1",
};
let called = false;

server.address = () => address;
process.send = message => {
    called = true;
    assert.deepStrictEqual(message, {
        type: "APP_SERVER/LISTENING",
        port: address.port,
        host: address.address,
    });
};

const publishListening = require("../../../../lib/universal-tools/publishListening").default;

publishListening(server);

server.emit("listening");

assert.ok(called, "process.send should have been called");
