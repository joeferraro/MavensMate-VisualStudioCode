import { Diagnostic, Position, Range, DiagnosticCollection, languages, Uri, workspace, TextDocument } from 'vscode';
import { CommandEventHandler } from './commandEventHandler';
import { MavensMateChannel } from '../../vscode/mavensMateChannel';
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
        if(result.success){
            console.log('clear diagnostics');
        } else {
            let componentFailures = this.getFailuresFromDetails(result);
            let paths = command.body.paths;
            let documentPromises = [];

            for(let path of paths){
                let documentPromise = workspace.openTextDocument(path);
                documentPromises.push(documentPromise);
            }

            Promise.all(documentPromises).then((openedDocuments: TextDocument[]) => {
                this.updateFailuresWithMatchingDocuments(openedDocuments, componentFailures);
                this.buildDiagnostics(componentFailures);
            });
        }
    }

    private getFailuresFromDetails(result){
        let failures = [];
        let componentFailures = result.details.componentFailures;
        if(componentFailures){
            if(componentFailures instanceof Array){
                for(let componentFailure of componentFailures){
                    if(componentFailure.DeployDetails){
                        for(let failure of componentFailure.DeployDetails.componentFailures){
                            failures.push(failure);
                        }
                    } else {
                        failures.push(componentFailure);
                    }
                }
            } else {
                failures.push(componentFailures);
            }
        }
        return failures;
    }

    private updateFailuresWithMatchingDocuments(documents: TextDocument[], componentFailures){
        let pathEndRegEx = /[^\\/]*[\\/]\w+[\.]\w+/;
        for(let componentFailure of componentFailures){
            let pathEnd = pathEndRegEx.exec(componentFailure.fileName)[0];
            for(let document of documents){
                if(document.uri.fsPath.endsWith(pathEnd)){
                    componentFailure.fullPath = document.uri.fsPath;
                    componentFailure.document = document;
                    break;
                }
            }
        }
    }

    private buildDiagnostics(componentFailures){
        let diagnosticsByFilePath = {};
        for(let componentFailure of componentFailures){
            if(!diagnosticsByFilePath[componentFailure.fullPath]){
                diagnosticsByFilePath[componentFailure.fullPath] = [];
            }
            let diagnostic = this.buildDiagnostic(componentFailure);
            diagnosticsByFilePath[componentFailure.fullPath].push(diagnostic);
        }
        for(let filePath in diagnosticsByFilePath){
            let fileUri = Uri.file(filePath);
            this.diagnotics.set(fileUri, diagnosticsByFilePath[filePath]);
        }
    }

    private buildDiagnostic(componentFailure): Diagnostic {
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

    onError(command: Command, result){
        return super.onError(command, result);
    }
}