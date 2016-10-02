import { ClientCommand } from './clientCommand';

import * as vscode from 'vscode';
import Promise = require('bluebird');
import path = require('path');

export abstract class PathsCommand extends ClientCommand {
    filePath: string;
    baseName: string;

    constructor(label: string, id: string) {
        super(label, id);
    }

    execute(selectedResource?: vscode.Uri): Thenable<any> {
        if(selectedResource && selectedResource.scheme === 'file'){
            this.filePath = selectedResource.fsPath;
        } else if(vscode.window.activeTextEditor && vscode.window.activeTextEditor.document) {
            this.filePath = vscode.window.activeTextEditor.document.uri.fsPath;
        }
        return this.confirmPath()
            .then(() => {
                this.body.paths = [this.filePath];
                return super.execute();
            });
    }

    protected confirmPath(): Thenable<any> {
        if(this.filePath && this.filePath.length > 0){
            this.baseName = path.basename(this.filePath);
            return Promise.resolve();
        } else {
            return Promise.reject(`A file path is required for ${this.label}`);
        }
    }

    onStart(): Promise<any>{
        return super.onStart()
            .then(() => {
                return this.outputPathProcessed();
            });
    }

    private outputPathProcessed(){
        let message = `${this.baseName} (${this.filePath})`
        return this.mavensMateChannel.appendLine(message);
    }

    onSuccess(response): Promise<any> {
        return super.onSuccess(response)
            .then(() => {
                this.outputPathProcessed();
                return response;
            });
    }

    onFailure(response): Promise<any> {
        return super.onFailure(response)
            .then(() => {
                this.outputPathProcessed().then(response);
                return response;
            });
    }
}