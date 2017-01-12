const fork = require("child_process").fork;
const PublishBuildStatusPlugin = require("./PublishBuildStatusPlugin");
const PauseWDSPlugin = require("./PauseWDSPlugin");

const pathToWebpackDevServer = require.resolve(".bin/webpack-dev-server");
const pathToWebpack = require.resolve(".bin/webpack");
const pathToServerProcess = require.resolve("../../bin/start-server");
const pathToWebpackConfig = require.resolve("../../config/webpack.config.js");
const APP_LISTENING = "APP/LISTENING";
const noop = Function.prototype;

function createServerProcess({
        wdsProcess,
        logServerListening = noop
    }) {
    const serverProcess = fork(
        pathToServerProcess, [],
        {
            env: process.env
        }
    );
    const messageHandlers = {
        [APP_LISTENING](message) {
            wdsProcess.send({ type: PauseWDSPlugin.CONTINUE });
            logServerListening(message.log);
        }
    };

    installMessageHandlers(serverProcess, messageHandlers);

    return serverProcess;
}

function createServerBuildProcess({
        wdsProcess,
        killServerProcess,
        createServerProcess,
        logBuildStart = noop,
        logBuildSuccess = noop,
        logBuildError = noop
    }) {
    const serverBuildProcess = fork(
        pathToWebpack, ["--config", pathToWebpackConfig, "--watch"],
        {
            silent: true,
            env: Object.assign({}, process.env, { WEBPACK_TARGET: "node" })
        }
    );
    const messageHandlers = {
        [PublishBuildStatusPlugin.COMPILATION]() {
            wdsProcess.send({ type: PauseWDSPlugin.PAUSE });
            killServerProcess();
            logBuildStart();
        },
        [PublishBuildStatusPlugin.DONE](message) {
            if (message.errorLog) {
                logBuildError(message.errorLog);
            }
            if (!message.hasErrors) {
                logBuildSuccess(message.duration);
                createServerProcess();
            }
        }
    };

    // Don't swallow errors -> awesome piping!
    serverBuildProcess.stderr.pipe(process.stderr);
    installMessageHandlers(serverBuildProcess, messageHandlers);

    return serverBuildProcess;
}

function createWDSProcess({
        logBuildStart = noop,
        logBuildSuccess = noop,
        logBuildError = noop
    }) {
    const wdsProcess = fork(
        pathToWebpackDevServer, ["--config", pathToWebpackConfig, "--hot"],
        {
            silent: true,
            env: Object.assign({}, process.env, { WEBPACK_TARGET: "web" })
        }
    );
    const messageHandlers = {
        [PublishBuildStatusPlugin.COMPILATION]() {
            logBuildStart();
        },
        [PublishBuildStatusPlugin.DONE](message) {
            if (message.errorLog) {
                logBuildError(message.errorLog);
            }
            if (!message.hasErrors) {
                logBuildSuccess(message.duration);
            }
        }
    };

    // Don't swallow errors -> awesome piping!
    wdsProcess.stderr.pipe(process.stderr);
    installMessageHandlers(wdsProcess, messageHandlers);

    return wdsProcess;
}

function installMessageHandlers(process, handlers) {
    process.on("message", message => {
        const handler = message && message.type && handlers[message.type];

        handler && handler(message);
    });
}

exports.createServerProcess = createServerProcess;
exports.createServerBuildProcess = createServerBuildProcess;
exports.createWDSProcess = createWDSProcess;
