import { Diagnostic, Position, Range, DiagnosticCollection, languages, Uri, workspace, TextDocument } from 'vscode';
import { CommandEventHandler } from './commandEventHandler';
import { getFailuresFromDetails, getSuccessesFromDetails } from './parsers/compileResultParser';
import { MavensMateChannel } from '../../vscode/mavensMateChannel';
import { buildDiagnosticsByFilePath } from '../../vscode/diagnosticFactory';
import { getPathEnd } from '../../workspace/componentPath';
import path = require('path')
import Command from '../command';

export class CompileEventHandler extends CommandEventHandler {
    diagnotics: DiagnosticCollection;

    static Create(channel: MavensMateChannel){
        return new CompileEventHandler(channel);
    }

    constructor(channel: MavensMateChannel){
        super(channel);

        this.diagnotics = languages.createDiagnosticCollection('mavensmate');
    }

    onStart(command: Command) {
        return super.onStart(command).then(() => {
            if(command.body.paths){
                this.channel.appendLine('Paths:'); 
                let baseNames: Promise<any>[] = [];
                for(let filePath of command.body.paths){
                    let baseName = path.basename(filePath);
                    this.channel.appendLine(baseName)
                }
            }
        });
    }

    onSuccess(command: Command, response){
        let result = response.result;
        if(result.status && result.status === 'Conflict'){
            this.handleConflict(command, result);
        } else {
            this.handleSuccess(command, result);
        }
        return super.onSuccess(command, result);
    }

    private handleConflict(command: Command, result){
        console.error('Need to write conflict');
    }

    private handleSuccess(command: Command, result){
        let componentSuccesses = getSuccessesFromDetails(result);
        let componentFailures = getFailuresFromDetails(result);

        return this.promiseClearDiagnosticsForSuccesses(command, componentSuccesses)
            .then(() => {
                this.promiseDiagnosticsFromFailures(command, componentFailures)
            });
    }

    private promiseClearDiagnosticsForSuccesses(command, componentSuccesses): Promise<any>{
        let paths = command.body.paths;
        
        return this.promiseComponentsWithMatchingDocuments(paths, componentSuccesses)
            .then((componentSuccesses) => {
                this.clearDiagnostics(componentSuccesses);
            });
    }

    private promiseComponentsWithMatchingDocuments(paths: string[], components){
        let documentPromises = [];

        for(let path of paths){
            let documentPromise = workspace.openTextDocument(path);
            documentPromises.push(documentPromise);
        }

        return Promise.all(documentPromises)
            .then((openedDocuments: TextDocument[]) => {
                return this.updateComponentsWithMatchingDocuments(openedDocuments, components);
            });
    }
    
    private updateComponentsWithMatchingDocuments(documents: TextDocument[], components){
        for(let component of components){
            let pathEnd = getPathEnd(component.fileName);
            for(let document of documents){
                if(document.uri.fsPath.endsWith(pathEnd)){
                    component.fullPath = document.uri.fsPath;
                    component.document = document;
                    break;
                }
            }
        }
        return components;
    }

    private clearDiagnostics(componentSuccesses){
        let filePathsToClear: Set<string> = new Set<string>();
        for(let componentSuccess of componentSuccesses){
            filePathsToClear.add(componentSuccess.fullPath);
        }
        filePathsToClear.forEach((filePath) => {
            let fileUri = Uri.file(filePath);
            this.diagnotics.set(fileUri, []);
        });
    }

    private promiseDiagnosticsFromFailures(command: Command, componentFailures){
        return this.promiseComponentsWithMatchingDocuments(command.body.paths, componentFailures)
            .then(buildDiagnosticsByFilePath)
            .then((diagnosticsByFilePath) => {
                this.updateDiagnostics(diagnosticsByFilePath);
            });
    }

    private updateDiagnostics(diagnosticsByFilePath: {}){
        for(let filePath in diagnosticsByFilePath){
            let fileUri = Uri.file(filePath);
            this.diagnotics.set(fileUri, diagnosticsByFilePath[filePath]);
        }
    }

    onError(command: Command, result){
        return super.onError(command, result);
    }
}