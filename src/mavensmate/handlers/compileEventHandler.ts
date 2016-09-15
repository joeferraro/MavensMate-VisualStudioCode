import * as vscode from 'vscode';
import { CommandEventHandler } from './commandEventHandler';
import * as CompileResultParser from './parsers/compileResultParser';
import { MavensMateChannel } from '../../vscode/mavensMateChannel';
import * as DiagnosticFactory from '../../vscode/diagnosticFactory';
import { getPathEnd } from '../../workspace/componentPath';
import path = require('path')
import Command from '../command';
import Promise = require('bluebird');

let compileLanguages = new Set<string>(['apex','visualforce','metadata']);

export class CompileEventHandler extends CommandEventHandler {
    diagnotics: vscode.DiagnosticCollection;

    static Create(channel: MavensMateChannel){
        return new CompileEventHandler(channel);
    }

    constructor(channel: MavensMateChannel){
        super(channel);

        this.diagnotics = vscode.languages.createDiagnosticCollection('mavensmate');
    }

    onStart(command: Command): Promise<any> {
        return super.onStart(command).then(() => {
            if(command.body.paths){
                this.channel.appendLine('Paths:'); 
                let baseNames: Promise<any>[] = [];
                for(let filePath of command.body.paths){
                    let baseName = path.basename(filePath);
                    this.channel.appendLine(baseName)
                }
            } else if(command.command !== 'compile-project'){
                console.error('No paths and not compile-project... ' + command.command + ' is expecting paths.');
            }
        });
    }

    onSuccess(command: Command, response): Promise<any>{
        let result = response.result;
        let handlePromise: Promise<any>;
        if(result.status && result.status === 'Conflict'){
            handlePromise = this.handleConflict(command, result);
        } else {
            handlePromise = this.handleSuccess(command, result);
        }
        return handlePromise.then(() => {
            super.onSuccess(command, result);
        },(error) => {
            console.error(error);
            super.onError(command, result);
        });
    }

    private handleConflict(command: Command, result){
        return Promise.resolve(() => {
            console.error('Need to write conflict');
        });
    }

    private handleSuccess(command: Command, result): Promise<any>{
        let componentSuccesses = CompileResultParser.getSuccessesFromDetails(result);
        let componentFailures = CompileResultParser.getFailuresFromDetails(result);

        return this.promiseClearDiagnosticsForSuccesses(componentSuccesses)
            .then(() => {
                return this.promiseDiagnosticsFromFailures(componentFailures)
            });
    }

    private promiseClearDiagnosticsForSuccesses(componentSuccesses): Promise<any>{
        return this.promiseComponentsWithMatchingDocuments(componentSuccesses)
            .bind(this)
            .then(this.clearDiagnostics);
    }

    private promiseComponentsWithMatchingDocuments(components){
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

    private clearDiagnostics(componentSuccesses){
        let filePathsToClear: Set<string> = new Set<string>();
        for(let componentSuccess of componentSuccesses){
            filePathsToClear.add(componentSuccess.fullPath);
        }
        filePathsToClear.forEach((filePath) => {
            let fileUri = vscode.Uri.file(filePath);
            this.diagnotics.set(fileUri, []);
        });
    }

    private promiseDiagnosticsFromFailures(componentFailures){
        return this.promiseComponentsWithMatchingDocuments(componentFailures)
            .then(DiagnosticFactory.buildDiagnosticsByFilePath)
            .bind(this)
            .then(this.updateDiagnostics);
    }

    private updateDiagnostics(diagnosticsByFilePath: {}){
        for(let filePath in diagnosticsByFilePath){
            let fileUri = vscode.Uri.file(filePath);
            this.diagnotics.set(fileUri, diagnosticsByFilePath[filePath]);
        }
    }

    onError(command: Command, result){
        return super.onError(command, result);
    }
}