import test from "ava"
import { buildStarted, buildSuccess, buildError } from "../../lib/messages/logMessages"
import normalizeLog from "../helpers/normalizeLog"

const in1300ms = 1300
const in300ms = 300

function check(message) {
    return t => {
        t.snapshot(normalizeLog(message))
    }
}

test(
    "should log the expected buildStarted",
    check(buildStarted("webpack client build"))
)

test(
    "should log the expected buildSuccess message with durations above 1 second",
    check(buildSuccess("webpack client build", in1300ms))
)

test(
    "should log the expected buildSuccess message with durations below 1 second",
    check(buildSuccess("webpack client build", in300ms))
)

test(
    "should log the expected buildError message",
    check(buildError("webpack client build", "Module build failed"))
)
