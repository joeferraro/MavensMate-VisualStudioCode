const fs = require('fs');
import bbPromise = require('bluebird');

export function readdir(filePath: string): bbPromise<string> {
    return new bbPromise<string>((resolve, reject) => {
        fs.readdir(filePath, (err, files) => {
            if (err) {
                console.error("Error reading directory " + filePath);
                reject();
            }
            return resolve(files);
        });
    });
}
