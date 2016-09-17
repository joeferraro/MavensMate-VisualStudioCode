import { ClientCommand } from './clientCommand';
import { ClientCommandInterface } from './clientCommandInterface';
import { BaseCommand } from './baseCommand';
import { MavensMateChannel } from '../../vscode/mavensMateChannel';
import { handleCompileResponse } from '../handlers/compileResponseHandler';

import * as vscode from 'vscode';
import path = require('path');

let mavensMateChannel: MavensMateChannel = MavensMateChannel.getInstance();

module.exports = class CompileFileCommand extends ClientCommand implements ClientCommandInterface {
    body: {
        paths: string[],
        args: {
            ui: boolean
        }
    }

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
            let compilePath = selectedResource.fsPath
            this.body.paths.push(compilePath);
            
            executePromise = super.execute().then(handleCompileResponse);
            mavensMateChannel.appendLine('Compiling: ' + path.basename(compilePath));
        } else {
            console.warn('Nothing to compile');
        }
        return executePromise;
    }

    executeTextEditor(textEditor: vscode.TextEditor, edit: vscode.TextEditorEdit): Thenable<any> {
        let selectedResource: vscode.Uri = textEditor.document.uri;
        return this.execute(selectedResource);
    }
}