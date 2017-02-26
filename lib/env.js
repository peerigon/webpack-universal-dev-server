// @flow

const PREFIX = "WUDS_";

export const WP_CONFIG_PATH = `${ PREFIX }WP_CONFIG_PATH`;
export const PUBLISHER = `${ PREFIX }PUBLISHER`;

export function get(key: string): string {
    return String(process.env[key] || "");
}
