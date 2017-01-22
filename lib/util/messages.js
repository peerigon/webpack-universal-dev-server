// @flow

const NAMESPACE = __filename;

// WDS = Webpack Dev Server (watches, compiles and serves the client bundle)
// WWP = Webpack Watch Process (watches and compiles the server bundle)
export const TYPE_WDS_PAUSE = `${ NAMESPACE }/WDS/PAUSE`;
export const TYPE_WDS_RESUME = `${ NAMESPACE }/WDS/RESUME`;
export const TYPE_WWP_COMPILATION = `${ NAMESPACE }/WWP/COMPILATION`;
export const TYPE_WWP_DONE = `${ NAMESPACE }/WWP/DONE`;

export type Message = {
    type: string;
};

export function wdsPause(): Message {
    return {
        type: TYPE_WDS_PAUSE
    };
}

export function wdsResume(): Message {
    return {
        type: TYPE_WDS_RESUME
    };
}

export function wwpCompilation(): Message {
    return {
        type: TYPE_WWP_COMPILATION
    };
}

export function wwpDone(): Message {
    return {
        type: TYPE_WWP_DONE
    };
}
