#!/usr/bin/env node
"use strict";

// This binary is restricted to the development environment. Do not use it in production.
// Having said this, it is safe to set NODE_ENV to "development".
process.env.NODE_ENV = "development";

// Ensure padding in terminal. This is supposed to make it easier for the developer to read the output.
console.log("");
process.on("exit", () => console.log(""));

const main = require("../dist/bin/webpack-universal-dev-server").default;

main();
