import { ClientCommand } from './clientCommand';
import StaticResourceQuickPick = require('../../vscode/staticResourceQuickPick');

import * as vscode from 'vscode';
import path = require('path');
import Promise = require('bluebird');

class CreateResourceBundle extends ClientCommand {
    filePath: string;
    baseName: string;

    static create(): ClientCommand{
        return new CreateResourceBundle();
    }

    constructor() {
        super('Create Resource Bundle', 'new-resource-bundle');
    }

    execute(selectedResource?: vscode.Uri): Thenable<any> {
        if(selectedResource && selectedResource.scheme === 'file'){
            this.filePath = selectedResource.fsPath;
        }
        return this.confirmPath()
            .then(() => {
                this.body.paths = [this.filePath];
                return super.execute();
            });
    }

    protected confirmPath(): Thenable<any> {
        if(this.filePath){
            let extension = path.extname(this.filePath);
            if(extension == 'resource'){
                return this.promptForConfirmation();
            } else {
                return Promise.reject(`${this.baseName} is not a Static Resource`);
            }
        }  else {
            return StaticResourceQuickPick.showStaticResourceQuickPick()
                .then((selectedStaticResource: StaticResourceQuickPick.staticResourceQuickPickItem) => {
                    this.filePath = selectedStaticResource.path;
                });
        }
    }

    private promptForConfirmation(){
        let confirmMessage = `Are you sure you want to create a resource bundle for ${ this.baseName }?`;
        return vscode.window.showInformationMessage(confirmMessage, 'Yes').then((answer) => {
            if(answer === 'Yes'){
                return Promise.resolve();
            } else {
                return Promise.reject(`${this.label} cancelled`);
            }
        });
    }
}
export = CreateResourceBundle;