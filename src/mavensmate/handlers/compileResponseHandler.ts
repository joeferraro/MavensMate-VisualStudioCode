import * as CompileResultParser from './parsers/compileResultParser';
import { getPathEnd } from '../../workspace/componentPath';
import * as vscode from 'vscode';
import path = require('path');
import { MavensMateDiagnostics } from '../../vscode/mavensMateDiagnostics';
import * as DiagnosticFactory from '../../vscode/diagnosticFactory';

let mavensMateDiagnostics: MavensMateDiagnostics = MavensMateDiagnostics.getInstance();

export function handleCompileResponse(compileResponse){
    let result = compileResponse.result;
    let handlePromise: Promise<any>;
    if(result.status && result.status === 'Conflict'){
        handlePromise = handleConflict(result);
    } else {
        handlePromise = handleSuccess(result);
    }
    return handlePromise;
}

function handleConflict(result){
    return Promise.resolve(() => {
        console.error('Need to write conflict');
    });
}

function handleSuccess(result): Promise<any>{
    let componentSuccesses = CompileResultParser.getSuccessesFromDetails(result);
    let componentFailures = CompileResultParser.getFailuresFromDetails(result);

    return promiseClearDiagnosticsForSuccesses(componentSuccesses)
        .then(() => {
            return promiseDiagnosticsFromFailures(componentFailures)
        });
}

function promiseClearDiagnosticsForSuccesses(componentSuccesses): Promise<any>{
    return promiseComponentsWithMatchingDocuments(componentSuccesses)
        .then(clearDiagnostics);
}

function promiseComponentsWithMatchingDocuments(components){
    let promisedComponents = []; 
    for(let component of components){
        let pathEnd = getPathEnd(component.fileName);
        let workspaceRoot = vscode.workspace.rootPath;
        let documentUri = path.join(workspaceRoot, 'src', pathEnd);

        let withMatchingDocument = vscode.workspace.openTextDocument(documentUri)
            .then((document) => {
                component.fullPath = document.uri.fsPath;
                component.document = document;
                return component;
            });
        promisedComponents.push(withMatchingDocument);
    }

    return Promise.all(promisedComponents);
}

function clearDiagnostics(componentSuccesses){
    let filePathsToClear: Set<string> = new Set<string>();
    for(let componentSuccess of componentSuccesses){
        filePathsToClear.add(componentSuccess.fullPath);
    }
    filePathsToClear.forEach((filePath) => {
        let fileUri = vscode.Uri.file(filePath);
        mavensMateDiagnostics.diagnostics.set(fileUri, []);
    });
}

function promiseDiagnosticsFromFailures(componentFailures){
    return promiseComponentsWithMatchingDocuments(componentFailures)
        .then(DiagnosticFactory.buildDiagnosticsByFilePath)
        .then(updateDiagnostics);
}

function updateDiagnostics(diagnosticsByFilePath: { [filePath: string]: vscode.Diagnostic[] }){
    for(let filePath in diagnosticsByFilePath){
        let fileUri = vscode.Uri.file(filePath);
        mavensMateDiagnostics.diagnostics.set(fileUri, diagnosticsByFilePath[filePath]);
    }
}