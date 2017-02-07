import { EOL } from "os";
import test from "ava";
import { buildStarted, buildSuccess, buildError } from "../../lib/util/logMessages";

// Colors cannot be tested in a good way because most CI systems don't use colors.
// We split the message by EOL to make these snapshot tests OS independent.
function check(message) {
    return t => {
        t.snapshot(message.split(EOL));
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
