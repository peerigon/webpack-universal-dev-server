#!/usr/bin/env node
/* eslint-disable no-console */

// This binary is restricted to the development environment
process.env.NODE_ENV = 'development';

// This implementation is not 100% exact because it might get out-of-sync in case the webpack build finishes sooner than
// the server re-starts. In this rare case, you may experience a proxy error in your browser.
// However, a simple browser refresh fixes it, so it is good enough for now.

const devHelper = require('../tools/webpack/devHelper');

const errorSeparator = '\n---------------------------------------------------------------------------\n';
const wdsProcess = devHelper.createWDSProcess({
    logBuildStart() {
        console.log(yellow('webpack client build started...'));
    },
    logBuildSuccess(duration) {
        console.log(green('webpack client build finished') + ' after ' + (duration / 1000).toFixed(1) + 's');
    },
    logBuildError(error) {
        console.log(errorSeparator);
        console.log('webpack client build error');
        console.log(errorSeparator);
        console.log(error);
        console.log(errorSeparator);
    }
});
let serverProcess;

function createServerProcess() {
    if (serverProcess) {
        return;
    }
    serverProcess = devHelper.createServerProcess({
        wdsProcess,
        logServerListening(log) {
            console.log(log);
        }
    });
}

function killServerProcess() {
    if (!serverProcess) {
        return;
    }
    console.log(yellow('Restarting web app...'));
    serverProcess.kill('SIGKILL');
    serverProcess = null;
}

function yellow(str) {
    return `\u001b[33m${ str }\u001b[39m`;
}

function green(str) {
    return `\u001b[32m${ str }\u001b[39m`;
}

devHelper.createServerBuildProcess({
    wdsProcess,
    killServerProcess,
    createServerProcess,
    logBuildStart() {
        console.log(yellow('webpack server build started...'));
    },
    logBuildSuccess(duration) {
        console.log(green('webpack server build finished') + ' after ' + (duration / 1000).toFixed(1) + 's');
    },
    logBuildError(error) {
        console.log('webpack server build error');
        console.log(errorSeparator);
        console.log(error);
        console.log(errorSeparator);
    }
});
