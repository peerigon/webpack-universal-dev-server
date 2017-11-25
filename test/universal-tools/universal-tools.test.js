import { exec as _exec } from "child_process";
import { resolve } from "path";
import test from "ava";

const exec = (
    fixture
) =>
    new Promise((res, rej) => {
        _exec(`node "${ resolve(__dirname, "fixtures", fixture) }"`, (err, stdout, stderr) => {
            err ? rej(err) : res(stdout || stderr);
        });
    });

test(
    "publishListening with process.send should emit the expected message",
    () => exec("publishListening/withProcessSend")
);

test(
    "publishListening with no process.send should not throw an error",
    () => exec("publishListening/noProcessSend")
);
