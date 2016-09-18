import { PathsCommand } from './pathsCommand';

import * as vscode from 'vscode';

module.exports = class RefreshFile extends PathsCommand {
    static create(){
        return new RefreshFile();
    }

    constructor() {
        super('Refresh File', 'refresh-metadata');
        this.async = true;
        this.body.args.ui = false;
    }

    execute(selectedResource?: vscode.Uri): Thenable<any> {
        let confirmMessage = 'Would you like to refresh this file from server?';
        let confirmPromise = vscode.window.showInformationMessage(confirmMessage, 'Yes').then((answer) => {
            if(answer === 'Yes'){
                return super.execute();
            } else {
                return;
            }
        }); 
        return confirmPromise;
    }
}