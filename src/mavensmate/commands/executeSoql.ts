import { ClientCommand } from './clientCommand';

import * as vscode from 'vscode';
import Promise = require('bluebird');

module.exports = class ExecuteSoql extends ClientCommand {
    static create(){
        return new ExecuteSoql();
    }

    constructor() {
        super('Execute SOQL', 'execute-soql');
        this.async = true;
        this.body.soql = '';
    }

    execute(selectedResource?: vscode.Uri): Thenable<any> {
        let inputBoxOptions = {
            prompt: 'Enter SOQL to execute',
            ignoreFocusOut: true
        };
        let inputBox = vscode.window.showInputBox(inputBoxOptions).then((soql) => {
            this.body.soql = soql;
            return super.execute();
        });
        return inputBox;
    }

    onStart(): Promise<any> {
        return super.onStart()
            .then(() => {
                let executeSoqlMessage = 'Executing SOQL: ' + this.body.soql;
                this.mavensMateChannel.appendLine(executeSoqlMessage);
            });
    }

    onSuccess(response): Promise<any> {
        return super.onSuccess(response)
            .then(() => this.handleExecuteSoqlResponse(response));
    }

    private handleExecuteSoqlResponse(response){
        vscode.workspace.openTextDocument(response.result.path)
            .then((document) => {
                vscode.window.showTextDocument(document);
            });
    }
}