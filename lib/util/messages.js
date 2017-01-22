// @flow

const NAMESPACE = __filename;

export const TYPE_PAUSE = `${ NAMESPACE }/PAUSE`;
export const TYPE_RESUME = `${ NAMESPACE }/RESUME`;

export type Message = {
    type: string;
};

export function pause(): Message {
    return {
        type: TYPE_PAUSE
    };
}

export function resume(): Message {
    return {
        type: TYPE_RESUME
    };
}
