import { ClientCommand } from './clientCommand';
import { ClientCommandInterface } from './clientCommandInterface';
import { BaseCommand } from './baseCommand';
import { MavensMateChannel } from '../../vscode/mavensMateChannel';
import { handleCompileResponse } from '../handlers/compileResponseHandler';

import * as vscode from 'vscode';
import path = require('path');
import Promise = require('bluebird');

let mavensMateChannel: MavensMateChannel = MavensMateChannel.getInstance();
let languagesToRun = new Set<string>(['apex']);

class RunApexScript extends ClientCommand implements ClientCommandInterface {
    body: {
        paths: string[],
        args: {
            ui: boolean
        }
    }
    filePath: string;

    static create(label?: string){
        if(!label){
            label = 'Run Apex Script';
        }
        return new RunApexScript(label);
    }

    constructor(label: string) {
        super(label);
        this.id = 'run-apex-script';
        this.async = true;
        
        this.body = {
            paths: [],
            args: {
                ui: false
            }
        };
    }

    execute(selectedResource?: vscode.Uri): Thenable<any> {
        let executePromise = null;
        if(selectedResource && selectedResource.scheme === 'file' && selectedResource.fsPath.indexOf('apex-scripts') !== -1){
            this.filePath = selectedResource.fsPath
            this.body.paths.push(this.filePath);
            executePromise = super.execute();
        } else {
            console.warn('Nothing to run');
        }
        return executePromise;
    }

    onStart(): Promise<any>{
        return super.onStart()
            .then(() => {
                let message = 'Running Apex Script: ' + path.basename(this.filePath);
                mavensMateChannel.appendLine(message);
            });
    }

    onFinish(response): Promise<any> {
        return super.onFinish(response)
            .then((response) => {
                for(let scriptName in response.result){
                    let scriptResult = response.result[scriptName];
                    if(scriptResult.success == true && scriptResult.compiled == true){
                        let message = 'Sucessfully Ran Apex Script: ' + scriptName;
                        mavensMateChannel.appendLine(message);
                    } else if(!scriptResult.success || scriptResult.success == false){
                        handleFailedRun(scriptResult);
                    }
                }
                
            }, (response) => {
                let message = 'Failed to Run Apex Script: ' + path.basename(this.filePath) + ` (${this.filePath})`;
                mavensMateChannel.appendLine(message);
            });
    }

    executeTextEditor(textEditor: vscode.TextEditor, edit: vscode.TextEditorEdit): Thenable<any> {
        if(languagesToRun.has(textEditor.document.languageId)){
            let selectedResource: vscode.Uri = textEditor.document.uri;
            return this.execute(selectedResource);
        }
    }
}
export = RunApexScript;

function handleFailedRun(scriptResult){
    let compileProblem = scriptResult.compileProblem;
    if(compileProblem && compileProblem != null){
        let lineNumber = scriptResult.line;
        let column = scriptResult.column;
        
        let message = `[Line: ${lineNumber}, Column: ${column}] ${compileProblem}`;
        mavensMateChannel.appendLine(message);
    }

    let exceptionMessage = scriptResult.exceptionMessage;
    if(exceptionMessage && exceptionMessage != null){
        mavensMateChannel.appendLine(exceptionMessage);
    }

    let exceptionStackTrace = scriptResult.exceptionStackTrace;
    if(exceptionStackTrace && exceptionStackTrace != null){
        mavensMateChannel.appendLine(exceptionStackTrace);
    }
}