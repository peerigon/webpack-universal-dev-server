// @flow

import type { WebpackDevServerSetup, ExpressApp } from "../types";
import pauseMiddleware from "../util/pauseMiddleware";

export default function devServerSetup(originalSetup?: WebpackDevServerSetup): WebpackDevServerSetup {
    return (...args) => {
        const app: ExpressApp = args[0];

        app.use(pauseMiddleware);

        return originalSetup ?
            // disabling some linting rules because we just want to preserve the original behavior as close as possible
            originalSetup.apply(this, args) : // eslint-disable-line no-invalid-this
            undefined; // eslint-disable-line no-undefined
    };
}
