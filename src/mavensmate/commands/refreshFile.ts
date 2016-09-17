import { ClientCommand } from './clientCommand';
import { ClientCommandInterface } from './clientCommandInterface';
import { BaseCommand } from './baseCommand';
import { MavensMateChannel } from '../../vscode/mavensMateChannel';
import { handleCompileResponse } from '../handlers/compileResponseHandler';

import * as vscode from 'vscode';
import path = require('path');

let mavensMateChannel: MavensMateChannel = MavensMateChannel.getInstance();

module.exports = class RefreshFile extends ClientCommand implements ClientCommandInterface {
    body: {
        paths?: string[],
        args?: {
            ui: boolean
        }
    }

    static create(){
        return new RefreshFile();
    }

    constructor() {
        super('Refresh File');
        this.id = 'refresh-metadata';
        this.async = true;
        
        this.body = {
            args: {
                ui: false
            }
        };
    }

    execute(selectedResource?: vscode.Uri): Thenable<any> {
        if(selectedResource && selectedResource.scheme === 'file'){
            let compilePath = selectedResource.fsPath
            this.body.paths = [compilePath];
            mavensMateChannel.appendLine('Refreshing: ' + path.basename(compilePath));
        }
        return super.execute().then(handleCompileResponse);
    }

    executeTextEditor(textEditor: vscode.TextEditor, edit: vscode.TextEditorEdit): Thenable<any> {
        let selectedResource: vscode.Uri = textEditor.document.uri;
        return this.execute(selectedResource);
    }
}