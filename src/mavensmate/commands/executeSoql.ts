import { ClientCommand } from './clientCommand';
import { ClientCommandInterface } from './clientCommandInterface';
import { BaseCommand } from './baseCommand';
import { MavensMateChannel } from '../../vscode/mavensMateChannel';
import { handleCompileResponse } from '../handlers/compileResponseHandler';

import * as vscode from 'vscode';
import path = require('path');
import Promise = require('bluebird');

let mavensMateChannel: MavensMateChannel = MavensMateChannel.getInstance();

module.exports = class ExecuteSoql extends ClientCommand implements ClientCommandInterface {
    body: {
        soql: string
    }

    static create(){
        return new ExecuteSoql();
    }

    constructor() {
        super('Execute SOQL');
        this.id = 'execute-soql';
        this.async = true;
        this.body = {
            soql: ''
        }
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
                mavensMateChannel.appendLine(executeSoqlMessage);
            });
    }

    onFinish(response): Promise<any> {
        return super.onFinish(response)
            .then((response) => {
                let executeSoqlMessage = 'SOQL Completed: ';
                mavensMateChannel.appendLine(executeSoqlMessage)
                    .then(() => this.handleExecuteSoqlResponse(response));
            }, (response) => {
                let executeSoqlMessage = 'Failed to execute SOQL';
                mavensMateChannel.appendLine(executeSoqlMessage);
            });
    }

    private handleExecuteSoqlResponse(response){
        vscode.workspace.openTextDocument(response.result.path)
            .then((document) => {
                vscode.window.showTextDocument(document);
            });
    }
}