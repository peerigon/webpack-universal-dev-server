// @flow

import checkEnv from "../../util/checkEnv"

export const WUDS_WP_CONFIG_PATH = "WUDS_WP_CONFIG_PATH"
export const WUDS_PUBLISHER = "WUDS_PUBLISHER"

const required = [
    WUDS_WP_CONFIG_PATH,
    WUDS_PUBLISHER
]

const env = {
    WUDS_WP_CONFIG_PATH: process.env[WUDS_WP_CONFIG_PATH] || "",
    WUDS_PUBLISHER: process.env[WUDS_PUBLISHER] || ""
}

checkEnv(env, required)

export default env
