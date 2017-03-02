import { EOL } from "os";

// We split the message by EOL to make these snapshot tests OS independent
export default function normalizeLog(log) {
    if (typeof log !== "string") {
        throw new TypeError(`Cannot normalize the log: The log is type of ${ typeof log } instead of 'string'.`);
    }

    return log.replace(new RegExp(EOL, "g"), "\n");
}
