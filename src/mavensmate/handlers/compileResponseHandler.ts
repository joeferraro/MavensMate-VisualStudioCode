import * as CompileResultParser from './parsers/compileResultParser';
import { getPathEnd } from '../../workspace/componentPath';
import * as vscode from 'vscode';
import path = require('path');
import Promise = require('bluebird');
import { MavensMateDiagnostics } from '../../vscode/mavensMateDiagnostics';
import * as DiagnosticFactory from '../../vscode/diagnosticFactory';

let mavensMateDiagnostics: MavensMateDiagnostics = MavensMateDiagnostics.getInstance();

export function handleCompileResponse(compileResponse): Promise<any>{
    let result = compileResponse.result;
    
    let handlePromise: Promise<any>;
    if(result){
        if(result.status && result.status === 'Conflict'){
            handlePromise = handleConflict(result);
        } else {
            handlePromise = handleSuccess(result);
        }
    } else {
        console.error(`MavensMate Compile Error Response ${compileResponse}`);
        return Promise.reject(compileResponse.error);
    }
    return handlePromise;
}

function handleConflict(result){
    let conflictPromises: Thenable<any>[] = [];
    let conflicts: any[] = result.details.conflicts;
    for(let conflictFile in conflicts){
        let conflict = conflicts[conflictFile];
        let lastModifiedBy = conflict.remote.LastModifiedBy.Name;
        let lastModifiedDate = conflict.remote.LastModifiedDate;

        let conflictMessage = `A conflict has been detected. ${conflictFile} `
            + `was last modified by ${lastModifiedBy} on ${lastModifiedDate}`;
        let overwriteMessage = 'Overwrite Server Copy';
        let conflictPromise = vscode.window.showWarningMessage(conflictMessage, overwriteMessage)
            .then((answer) => {
                if(answer == overwriteMessage){
                    return forceCompileConflictFile(conflict);
                }
            });
        conflictPromises.push(conflictPromise);
    }

    return Promise.all(conflictPromises);
}

function forceCompileConflictFile(conflict){
    let fileName = conflict.local.fileName;
    let pathEnd = getPathEnd(fileName);
    let workspaceRoot = vscode.workspace.rootPath;
    let documentUri = vscode.Uri.file(path.join(workspaceRoot, 'src', pathEnd));
    return vscode.commands.executeCommand('mavensmate.forceCompileFile', documentUri);
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
        .then(updateDiagnostics)
        .then(showProblemsPanel)
}

function updateDiagnostics(diagnosticsByFilePath: { [filePath: string]: vscode.Diagnostic[] }){
    for(let filePath in diagnosticsByFilePath){
        let fileUri = vscode.Uri.file(filePath);
        mavensMateDiagnostics.diagnostics.set(fileUri, diagnosticsByFilePath[filePath]);
    }
    return diagnosticsByFilePath;
}

function showProblemsPanel(diagnosticsByFilePath: { [filePath: string]: vscode.Diagnostic[] }){ 
    if (Object.keys(diagnosticsByFilePath).length > 0) {
        return vscode.commands.executeCommand('workbench.actions.view.problems');
    }
}