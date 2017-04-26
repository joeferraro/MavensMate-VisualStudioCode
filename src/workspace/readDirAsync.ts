const fs = require('fs');
import bbPromise = require('bluebird');

export async function readdir(filePath: string): bbPromise<string> {
    return new bbPromise<string>((resolve, reject) => {
        fs.readdir(filePath, (err, files) => {
            if (err) { reject("Error reading directory " + filePath) }
            return resolve(files);
        });
    });
}
