// @flow

import { WUDSError } from "./error";

type ProcessEnv = { [key: string]: ?string };
type RequiredKeys = Array<string>;

export default (
    env: ProcessEnv,
    requiredKeys: RequiredKeys
): void => {
    void requiredKeys.forEach(key => {
        if (key in env === false) {
            throw new WUDSError(`The required env variable '${ key }' is not defined on process.env: Please specify it when creating the child_process`);
        }
    });
};
