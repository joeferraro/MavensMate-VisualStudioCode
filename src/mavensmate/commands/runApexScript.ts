import { PathsCommand } from './pathsCommand';

import * as vscode from 'vscode';
import Promise = require('bluebird');
import path = require('path');

let languagesToRun = new Set<string>(['apex']);

class RunApexScript extends PathsCommand {
    static create(label?: string){
        if(!label){
            label = 'Run Apex Script';
        }
        return new RunApexScript(label);
    }

    constructor(label: string) {
        super(label, 'run-apex-script');
    }

    protected confirmPath(): Thenable<any> {
        if(this.filePath.indexOf('apex-scripts') !== -1){
            return super.confirmPath();
        } else {
            return Promise.reject(`Local Apex Scripts can't be compiled. You can run them with Run Apex Script`);
        }
    }


    onSuccess(response): Promise<any> {
        return super.onSuccess(response)
            .then((response) => {
                for(let scriptName in response.result){
                    let scriptResult = response.result[scriptName];
                    if(scriptResult.success == true && scriptResult.compiled == true){
                        let message = 'Sucessfully Ran Apex Script: ' + scriptName;
                        this.mavensMateChannel.appendLine(message);
                    } else if(!scriptResult.success || scriptResult.success == false){
                        this.handleFailedRun(scriptResult);
                    }
                }
            });
    }

    private handleFailedRun(scriptResult){
        let compileProblem = scriptResult.compileProblem;
        if(compileProblem && compileProblem != null){
            let lineNumber = scriptResult.line;
            let column = scriptResult.column;
            
            let message = `[Line: ${lineNumber}, Column: ${column}] ${compileProblem}`;
            this.mavensMateChannel.appendLine(message);
        }

        let exceptionMessage = scriptResult.exceptionMessage;
        if(exceptionMessage && exceptionMessage != null){
            this.mavensMateChannel.appendLine(exceptionMessage);
        }

        let exceptionStackTrace = scriptResult.exceptionStackTrace;
        if(exceptionStackTrace && exceptionStackTrace != null){
            this.mavensMateChannel.appendLine(exceptionStackTrace);
        }
    }

    executeTextEditor(textEditor: vscode.TextEditor, edit: vscode.TextEditorEdit): Thenable<any> {
        if(languagesToRun.has(textEditor.document.languageId)){
            let selectedResource: vscode.Uri = textEditor.document.uri;
            return this.execute(selectedResource);
        }
    }
}
export = RunApexScript;