import { ClientCommand } from './clientCommand';
import { BaseCommand } from './baseCommand';
import * as vscode from 'vscode';

module.exports = class CleanProject extends ClientCommand {
    body: {
        args: {
            ui: boolean
        }
    }
    static create(): BaseCommand {
        return new CleanProject();
    }

    constructor() {
        super('Clean Project');
        this.id = 'clean-project';
        this.async = true;
        this.body = {
            args: {
                ui: true
            }
        }
    }

    execute(): Thenable<any> {
        let confirmMessage = 'Confirm clean project? All local (non-server) files will be deleted and your project will be refreshed from the server';
        return vscode.window.showWarningMessage(confirmMessage, 'Yes').then((answer) => {
            if(answer === 'Yes'){
                return super.execute();
            } else {
                return;
            }
        }); 
    }
}