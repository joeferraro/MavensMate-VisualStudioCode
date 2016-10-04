let fs = require('fs');

export function open(filePath : string){
    try {
        let fileBody = fs.readFileSync(filePath);
        return JSON.parse(fileBody);
    } catch(openException){
        console.warn('Failed to open ' + filePath);
        return null;
    }
}