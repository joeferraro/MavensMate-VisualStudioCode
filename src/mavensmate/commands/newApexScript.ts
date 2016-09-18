import { ClientCommand } from './clientCommand';
import { BaseCommand } from './baseCommand';
import * as vscode from 'vscode';

module.exports = class EditProject extends ClientCommand {
    body: {
        name?: string,
        args: {
            ui: boolean
        }
    }
    static create(): BaseCommand {
        return new EditProject();
    }

    constructor() {
        super('New Apex Script');
        this.id = 'new-apex-script';
        this.async = false;
        this.body = {
            args: {
                ui: true
            }
        }
    }

    execute(): Thenable<any> {
        let inputBox = vscode.window.showInputBox({
            prompt: 'Provide a name for the Apex Script'
        }).then((apexScriptName) => {
            this.body.name = apexScriptName;
            return super.execute();
        });
        return inputBox;
    }
}