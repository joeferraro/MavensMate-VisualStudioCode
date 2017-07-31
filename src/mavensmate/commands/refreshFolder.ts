import { PathsCommand } from './pathsCommand';

import * as vscode from 'vscode';

module.exports = class RefreshFolder extends PathsCommand {
    static create(){
        return new RefreshFolder();
    }

    constructor() {
        super('Refresh Folder', 'refresh-metadata');
        this.async = true;
        this.body.args.ui = false;
    }

    protected confirmPath(): Thenable<any> {
        return super.confirmPath().then(() => this.promptForConfirmation());
    }

    private promptForConfirmation(){
        let confirmMessage = `Are you sure you want to refresh ${ this.baseName } from Salesforce?`;
        return vscode.window.showInformationMessage(confirmMessage, 'Yes').then((answer) => {
            if(answer === 'Yes'){
                return Promise.resolve();
            } else {
                return Promise.reject('Refresh File Cancelled');
            }
        });
    }
}
