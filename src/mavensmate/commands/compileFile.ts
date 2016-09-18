import { ClientCommand } from './clientCommand';
import { ClientCommandInterface } from './clientCommandInterface';
import { BaseCommand } from './baseCommand';
import { MavensMateChannel } from '../../vscode/mavensMateChannel';
import { handleCompileResponse } from '../handlers/compileResponseHandler';

import * as vscode from 'vscode';
import path = require('path');
import Promise = require('bluebird');

let mavensMateChannel: MavensMateChannel = MavensMateChannel.getInstance();
let languagesToCompileOnSave = new Set<string>(['apex', 'visualforce', 'xml', 'javascript']);

class CompileFile extends ClientCommand implements ClientCommandInterface {
    body: {
        paths: string[],
        force?: boolean,
        args: {
            ui: boolean
        }
    }
    compilePath: string;

    static create(label?: string){
        if(!label){
            label = 'Compile File';
        }
        return new CompileFile(label);
    }

    constructor(label: string) {
        super(label);
        this.id = 'compile-metadata';
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
        if(selectedResource && selectedResource.scheme === 'file'){
            if(selectedResource.fsPath.indexOf('apex-scripts') === -1){
                this.compilePath = selectedResource.fsPath
                this.body.paths.push(this.compilePath);
                executePromise = super.execute();    
            }
        } else {
            console.warn('Nothing to compile');
        }
        return executePromise;
    }

    onStart(): Promise<any>{
        return super.onStart()
            .then(() => {
                let compileMessage = 'Compiling: ' + path.basename(this.compilePath);
                mavensMateChannel.appendLine(compileMessage);
            });
    }

    onFinish(response): Promise<any> {
        return super.onFinish(response)
            .then((response) => {
                let message = 'Compiled: ' + path.basename(this.compilePath) + ` (${this.compilePath})`;
                return mavensMateChannel.appendLine(message)
                    .then(() => handleCompileResponse(response));
            }, (response) => {
                let message = 'Failed to Compile: ' + path.basename(this.compilePath) + ` (${this.compilePath})`;
                mavensMateChannel.appendLine(message);
            });
    }

    executeTextEditor(textEditor: vscode.TextEditor, edit: vscode.TextEditorEdit): Thenable<any> {
        if(languagesToCompileOnSave.has(textEditor.document.languageId)){
            let selectedResource: vscode.Uri = textEditor.document.uri;
            return this.execute(selectedResource);
        }
    }
}
export = CompileFile;