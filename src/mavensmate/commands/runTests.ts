import { ClientCommand } from './clientCommand';
import * as vscode from 'vscode';
import Promise = require('bluebird');
import path = require('path');


class RunTests extends ClientCommand {
    filePath: string;
    baseName: string;

    static create() {
        return new RunTests();
    }

    constructor() {
        super('Run Apex Tests', 'run-tests');
        this.async = false;
        this.body.args.ui = true;
    }

    execute(selectedResource?: vscode.Uri): Thenable<any> {
        if(selectedResource && selectedResource.scheme === 'file'){
            this.filePath = selectedResource.fsPath;
        } else if(vscode.window.activeTextEditor && vscode.window.activeTextEditor.document) {
            this.filePath = vscode.window.activeTextEditor.document.uri.fsPath;
        }
        return this.confirmPath()
            .then(() => {
                this.body.classes = [this.baseName];
                return super.execute();
            });
    }

    protected confirmPath(): Thenable<any> {
        if(this.filePath && this.filePath.length > 0){
            this.baseName = path.basename(this.filePath, '.cls'); 
        }
        return Promise.resolve();
    }

    onStart(): Promise<any>{
        return super.onStart()
            .then(() => {
                return this.outputPathProcessed();
            });
    }

    private outputPathProcessed(){
        if(this.baseName && this.filePath){
            let message = `${this.baseName} (${this.filePath})`
            return this.mavensMateChannel.appendLine(message);
        } else {
            return Promise.resolve();
        }
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

export = RunTests;