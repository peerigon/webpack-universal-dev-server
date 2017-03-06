"use strict"

require("babel-register") // eslint-disable-line import/no-unassigned-import

const assert = require("assert")
const EventEmitter = require("events")

const server = new EventEmitter()
const address = {
    port: 1337,
    address: "127.0.0.1"
}

server.address = () => address
delete process.send

const publishListening = require("../../../../lib/universal-tools/publishListening").default

assert.doesNotThrow(() => {
    publishListening(server)
    server.emit("listening")
})

