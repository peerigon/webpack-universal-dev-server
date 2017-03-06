// @flow

import type { WebpackDevServerSetupHandler, ExpressApp } from "../../types"
import pauseMiddleware from "../../util/pauseMiddleware"

type ReturnType = any
type OriginalSetup = WebpackDevServerSetupHandler<ReturnType>

export default (
    originalSetup?: OriginalSetup
): OriginalSetup => (function ( // we need a function to capture `this`
    app: ExpressApp,
    ...args
): ReturnType {
    return (
        app.use(pauseMiddleware),
        originalSetup && originalSetup.call(
            this, // eslint-disable-line no-invalid-this
            app,
            ...args
        )
    )
})
