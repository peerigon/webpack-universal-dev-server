/**
 * Adds a pause middleware to the webpack-dev-server that can be switched on and off via process messages.
 * If the middleware is activated, all incoming requests will be delayed until it receives the continue message.
 */

const NAMESPACE = "PAUSE_WDS_PLUGIN";
const PAUSE = `${ NAMESPACE }/PAUSE`;
const CONTINUE = `${ NAMESPACE }/CONTINUE`;
const messageHandlers = {
    [PAUSE]() {
        if (!deferred) {
            deferred = createDeferred();
        }
    },
    [CONTINUE]() {
        deferred && deferred.resolve();
        deferred = null;
    }
};
const matchHotUpdate = /hot-update\.json$/;
let deferred;

function PauseWDSPlugin(options = {}) {
    this.options = options;
}

function createDeferred() {
    const deferred = {};

    deferred.promise = new Promise((resolve, reject) => {
        deferred.resolve = resolve;
        deferred.reject = reject;
    });

    return deferred;
}

function pauseMiddleware(req, res, next) {
    if (matchHotUpdate.test(req.url)) {
        // Don't pause hot update manifest requests, these are essential for the HMR client
        next();
        return;
    }
    if (!deferred) {
        next();
        return;
    }
    deferred.promise.then(next, next);
}

function installMessageHandlers(process, handlers) {
    process.on("message", message => {
        const handler = message && message.type && handlers[message.type];

        handler && handler(message);
    });
}

PauseWDSPlugin.PAUSE = PAUSE;
PauseWDSPlugin.CONTINUE = CONTINUE;

PauseWDSPlugin.prototype.apply = function (compiler) {
    compiler.options.devServer = compiler.options.devServer || {};

    const originalSetup = compiler.options.devServer.setup || Function.prototype;

    compiler.options.devServer.setup = function (app) {
        app.use(pauseMiddleware);
        originalSetup.apply(this, arguments);
    };
};

installMessageHandlers(process, messageHandlers);

module.exports = PauseWDSPlugin;
