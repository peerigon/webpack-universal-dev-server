// @flow

import { throwError, WUDSError } from "./error";

type ProcessEnv = { [key: string]: ?string };
type RequiredKeys = Array<string>;

export default (
    env: ProcessEnv,
    requiredKeys: RequiredKeys
) =>
    requiredKeys.forEach(key =>
        !env[key] && throwError(
            new WUDSError(`The required env variable '${ key }' is not defined on process.env: Please specify it when creating the child_process`)
        )
    );
