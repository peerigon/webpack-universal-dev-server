// @flow

import type { PublishBuildStatusPluginOptions, WebpackCompiler, WebpackStats } from "../types";
import { wwpCompilation, wwpDone } from "../util/messages";

export default class PublishBuildStatusPlugin {
    options: PublishBuildStatusPluginOptions

    constructor(options: PublishBuildStatusPluginOptions) {
        const { publish, publisher } = options;

        if (typeof publish !== "function") {
            throw new Error("No publish function given");
        }
        if (publisher == null) {
            throw new Error("No publisher id given");
        }

        this.options = options;
    }

    apply(compiler: WebpackCompiler) {
        compiler.plugin("compilation", () => {
            this.options.publish(
                wwpCompilation(this.options.publisher)
            );
        });
        compiler.plugin("done", (stats: WebpackStats) => {
            this.options.publish(
                wwpDone(this.options.publisher, stats)
            );
        });
    }
}
