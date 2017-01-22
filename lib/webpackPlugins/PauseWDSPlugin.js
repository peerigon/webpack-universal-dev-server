import pauseMiddleware from "../util/pauseMiddleware";

export type PauseWDSPluginOptions = {};

class PauseWDSPlugin {
    options: PauseWDSPluginOptions;

    constructor(options: PauseWDSPluginOptions = {}) {
        this.options = options;
    }

    apply(compiler) {
        compiler.options.devServer = compiler.options.devServer || {};

        const originalSetup = compiler.options.devServer.setup || Function.prototype;

        compiler.options.devServer.setup = function (app) {
            app.use(pauseMiddleware);
            return originalSetup.apply(this, arguments);
        };
    }

}

export default PauseWDSPlugin;
