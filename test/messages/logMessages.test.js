import test from "ava";
import { buildStarted, buildSuccess, buildError } from "../../lib/messages/logMessages";
import normalizeLog from "../helpers/normalizeLog";

function check(message) {
    return t => {
        t.snapshot(normalizeLog(message));
    };
}

test(
    "should log the expected buildStarted",
    check(buildStarted("webpack client build"))
);

test(
    "should log the expected buildSuccess message with durations above 1 second",
    check(buildSuccess("webpack client build", 1300))
);

test(
    "should log the expected buildSuccess message with durations below 1 second",
    check(buildSuccess("webpack client build", 300))
);

test(
    "should log the expected buildError message",
    check(buildError("webpack client build", "Module build failed"))
);
