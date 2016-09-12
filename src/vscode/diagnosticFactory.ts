import { Diagnostic, Position, Range, DiagnosticCollection, languages, Uri, workspace, TextDocument } from 'vscode';

export function buildDiagnosticsByFilePath(componentFailures){
    let diagnosticsByFilePath = {};
    for(let componentFailure of componentFailures){
        if(!diagnosticsByFilePath[componentFailure.fullPath]){
            diagnosticsByFilePath[componentFailure.fullPath] = [];
        }
        let diagnostic = buildDiagnostic(componentFailure);
        diagnosticsByFilePath[componentFailure.fullPath].push(diagnostic);
    }
    return diagnosticsByFilePath;
}

export function buildDiagnostic(componentFailure): Diagnostic {
    let lineNumber: number = 0;
    let columnNumber: number = 0;

    if(componentFailure.lineNumber){
        lineNumber = componentFailure.lineNumber - 1;
    }
    if(componentFailure.columnNumber){
        columnNumber = componentFailure.columnNumber - 1;
    }

    let start = new Position(lineNumber, columnNumber);
    let end = new Position(lineNumber+1, 0);
    let range = new Range(start, end);

    if(componentFailure.document){
        let document: TextDocument = componentFailure.document;
        range = document.getWordRangeAtPosition(start);
    }

    let newDiagnostic = new Diagnostic(range, componentFailure.problem);

    return newDiagnostic;
}