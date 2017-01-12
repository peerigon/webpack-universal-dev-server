/**
 * Publishes various compiler hooks via process.send(). Make sure we are in a forked node process here.
 */

const NAMESPACE = "PUBLISH_BUILD_STATUS_PLUGIN";
const COMPILATION = `${ NAMESPACE }/COMPILATION`;
const DONE = `${ NAMESPACE }/DONE`;

function PublishBuildStatusPlugin(options = {}) {
    const { publisherId } = options;

    if (!process.send) {
        // If process.send() is not a function, this process has no built-in ipc channel
        throw new Error("process has no send() method. This plugin works only in a forked node process");
    }
    if (publisherId == null) {
        throw new Error("No publisherId given");
    }

    this.options = options;
}

PublishBuildStatusPlugin.COMPILATION = COMPILATION;
PublishBuildStatusPlugin.DONE = DONE;

PublishBuildStatusPlugin.prototype.apply = function (compiler) {
    const id = this.options.publisherId;

    compiler.plugin("compilation", () => {
        process.send({
            id,
            type: COMPILATION
        });
    });
    compiler.plugin("done", stats => {
        process.send({
            id,
            type: DONE,
            duration: stats.endTime - stats.startTime,
            hasErrors: stats.hasErrors(),
            hasWarnings: stats.hasWarnings(),
            errorLog: stats.toString("errors-only")
        });
    });
};

module.exports = PublishBuildStatusPlugin;
