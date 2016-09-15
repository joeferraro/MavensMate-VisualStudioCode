let fs = require('fs');

export function open(filePath : string){
    let fileBody = fs.readFileSync(filePath);
    return JSON.parse(fileBody);
}