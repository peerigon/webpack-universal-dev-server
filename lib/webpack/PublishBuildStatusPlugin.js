// @flow

import type { MessageHandler, WpCompilationMessage, WpDoneMessage, WebpackCompiler, WebpackStats } from "../types";
import { wpCompilation, wpDone } from "../messages";

type PublishBuildStatusPluginOptions = {
    +publisher: string,
    +publish: MessageHandler<WpCompilationMessage | WpDoneMessage>
};

const checkPublisher = (
    publisher?: *
): void => {
    if (typeof publisher === "undefined" || publisher === null || publisher === "") {
        throw new Error("No publisher id given");
    }
};
const checkPublish = (
    publish?: *
): void => {
    if (typeof publish !== "function") {
        throw new Error("No publish function given");
    }
};

export default class PublishBuildStatusPlugin {
    options: PublishBuildStatusPluginOptions

    constructor(options: PublishBuildStatusPluginOptions): void {
        void checkPublish(options.publish);
        void checkPublisher(options.publisher);
        this.options = options;
    }

    apply(compiler: WebpackCompiler): void {
        void compiler.plugin("compilation", () => {
            void this.options.publish(
                wpCompilation(this.options.publisher)
            );
        });
        void compiler.plugin("done", (stats: WebpackStats) => {
            void this.options.publish(
                wpDone(this.options.publisher, stats)
            );
        });
    }
}
