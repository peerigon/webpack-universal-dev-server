// @flow

import type { WebpackDevServerSetupHandler, ExpressApp } from "../../types";
import pauseMiddleware from "../../util/pauseMiddleware";

type DevServerSetupResult = *;
type OriginalSetup = WebpackDevServerSetupHandler<DevServerSetupResult>;

export default (
    originalSetup?: OriginalSetup
): OriginalSetup => (function captureThis(
    app: ExpressApp,
    ...args
): DevServerSetupResult {
    return (
        app.use(pauseMiddleware),
        originalSetup && originalSetup.call(
            this, // eslint-disable-line no-invalid-this
            app,
            ...args
        )
    );
});
