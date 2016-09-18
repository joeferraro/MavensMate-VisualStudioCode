import { ClientCommand } from './clientCommand';
import { ClientCommandInterface } from './clientCommandInterface';
import { BaseCommand } from './baseCommand';
import { MavensMateChannel } from '../../vscode/mavensMateChannel';
import { handleCompileResponse } from '../handlers/compileResponseHandler';

import * as vscode from 'vscode';
import path = require('path');
import Promise = require('bluebird');

let mavensMateChannel: MavensMateChannel = MavensMateChannel.getInstance();

module.exports = class RefreshFile extends ClientCommand implements ClientCommandInterface {
    body: {
        paths?: string[],
        args?: {
            ui: boolean
        }
    }
    refreshPath: string;

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
        let executePromise = null;
        if(selectedResource && selectedResource.scheme === 'file'){
            this.refreshPath = selectedResource.fsPath
            this.body.paths = [this.refreshPath];
            let confirmMessage = 'Would you like to refresh this file from server?';
            executePromise = vscode.window.showInformationMessage(confirmMessage, 'Yes').then((answer) => {
                if(answer === 'Yes'){
                    return super.execute();
                } else {
                    return;
                }
            }); 
        } else {
            console.warn('Nothing to refresh');
        }
        return executePromise;
    }

    onStart(): Promise<any> {
        return super.onStart()
            .then(() => {
                let refreshMessage = 'Refreshing: ' + path.basename(this.refreshPath) + ` (${this.refreshPath})`;
                mavensMateChannel.appendLine(refreshMessage);
            });
    }

    onFinish(response): Promise<any> {
        return super.onFinish(response)
            .then((response) => {
                let refreshMessage = 'Refreshed: ' + path.basename(this.refreshPath) + ` (${this.refreshPath})`;
                mavensMateChannel.appendLine(refreshMessage);
            }, (response) => {
                let refreshMessage = 'Failed to Refresh: ' + path.basename(this.refreshPath) + ` (${this.refreshPath})`;
                mavensMateChannel.appendLine(refreshMessage);
            });
    }

    executeTextEditor(textEditor: vscode.TextEditor, edit: vscode.TextEditorEdit): Thenable<any> {
        let selectedResource: vscode.Uri = textEditor.document.uri;
        return this.execute(selectedResource);
    }
}