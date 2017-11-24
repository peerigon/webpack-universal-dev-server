import { spawn } from "child_process";
import { existsSync } from "fs";
import path from "path";
import consumeUntil from "consume-until";

const pathToBin = require.resolve("../../bin/webpack-universal-dev-server.js");

export function spawnBin({ args = [], cwd = process.cwd() }) {
    if (existsSync(cwd) === false) {
        // Sanity check for cwd because node reports a confusing error message
        // https://github.com/nodejs/node/issues/11520
        throw new Error(`Given cwd ${ cwd } does not exist`);
    }

    const cp = Object.create(spawn(
        process.execPath,
        [pathToBin].concat(args),
        { cwd }
    ));
    let expectError = false;

    cp.on("error", error => {
        if (expectError) {
            return;
        }
        throw error;
    });
    cp.on("exit", code => {
        if (expectError && code === 0) {
            throw new Error("Expected error, but received exit code 0");
        }
    });

    cp.stdoutPattern = function (pattern) {
        return new Promise((resolve, reject) => {
            consumeUntil(
                cp.stdout,
                pattern,
                err => (err ? reject(err) : resolve())
            );
        });
    };
    cp.expectError = function () {
        expectError = true;
    };

    return cp;
}

export function fixtureConfig(fixtureName) {
    return `--config ${ path.resolve(fixturePath(fixtureName), "webpack.config.js") }`;
}

export function fixturePath(fixtureName) {
    return path.resolve(__dirname, "..", "fixture", fixtureName);
}
