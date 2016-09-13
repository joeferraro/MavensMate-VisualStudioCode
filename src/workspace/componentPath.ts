let pathEndRegEx = /(unpackaged)?([^\\/]*[\\/]\w+[\.]\w+)/;

export function getPathEnd(path: string): string{
    let pathEnd: string = path;
    let matches: string[] = pathEndRegEx.exec(path);

    if(matches && matches.length > 0){
        pathEnd = matches[matches.length-1];
    } else {
        console.error('Failed to get the pathEnd from: ' + path);
    }
    return pathEnd;
}