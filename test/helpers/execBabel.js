import { exec } from "child_process";

function execBabel(inputFile, outputFile) {
    return new Promise((resolve, reject) => {
        exec(
            `node ./node_modules/.bin/babel ${ inputFile } -o ${ outputFile }`,
            (err, stdout) => err ? reject(err) : resolve(stdout)
        );
    });
}

export default execBabel;
