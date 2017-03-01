// @flow

import type { MessageHandler, WpCompilationMessage, WpDoneMessage, WebpackCompiler, WebpackStats } from "../types";
import { wpCompilation, wpDone } from "../messages";

type PublishBuildStatusPluginOptions = {
    +publisher: string,
    +publish: MessageHandler<WpCompilationMessage | WpDoneMessage>
};

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
                wpCompilation(this.options.publisher)
            );
        });
        compiler.plugin("done", (stats: WebpackStats) => {
            this.options.publish(
                wpDone(this.options.publisher, stats)
            );
        });
    }
}
