import { ClientCommand } from './clientCommand';
import { ClientCommandInterface } from './clientCommandInterface';
import { BaseCommand } from './baseCommand';
import { MavensMateChannel } from '../../vscode/mavensMateChannel';
import { handleCompileResponse } from '../handlers/compileResponseHandler';

import * as vscode from 'vscode';
import path = require('path');
import Promise = require('bluebird');

let mavensMateChannel: MavensMateChannel = MavensMateChannel.getInstance();

module.exports = class CompileFileCommand extends ClientCommand implements ClientCommandInterface {
    body: {
        paths: string[],
        args: {
            ui: boolean
        }
    }
    compilePath: string;

    static create(){
        return new CompileFileCommand();
    }

    constructor() {
        super('Compile File');
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
            this.compilePath = selectedResource.fsPath
            this.body.paths.push(this.compilePath);
            executePromise = super.execute().then(handleCompileResponse);
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
                let refreshMessage = 'Compiled: ' + path.basename(this.compilePath) + ` (${this.compilePath})`;
                mavensMateChannel.appendLine(refreshMessage);
            }, (response) => {
                let refreshMessage = 'Failed to Compile: ' + path.basename(this.compilePath) + ` (${this.compilePath})`;
                mavensMateChannel.appendLine(refreshMessage);
            });
    }

    executeTextEditor(textEditor: vscode.TextEditor, edit: vscode.TextEditorEdit): Thenable<any> {
        let selectedResource: vscode.Uri = textEditor.document.uri;
        return this.execute(selectedResource);
    }
}