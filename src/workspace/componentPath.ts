let pathEndRegEx = /[^\\/]*[\\/]\w+[\.]\w+/;

export function getPathEnd(path: string): string{
    let pathEnd: string = path;
    let matches: string[] = pathEndRegEx.exec(path);

    if(matches && matches.length > 0){
        pathEnd = matches[0];
    } else {
        console.error('Failed to get the pathEnd from: ' + path);
    }
    return pathEnd;
}