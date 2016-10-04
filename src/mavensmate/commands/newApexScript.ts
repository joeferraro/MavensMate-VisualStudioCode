import { ClientCommand } from './clientCommand';
import { BaseCommand } from './baseCommand';
import * as vscode from 'vscode';

module.exports = class EditProject extends ClientCommand {
    static create(): BaseCommand {
        return new EditProject();
    }

    constructor() {
        super('New Apex Script', 'new-apex-script');
        this.async = false;
        this.body.args.ui = true;
    }

    execute(): Thenable<any> {
        let inputBoxOptions = {
            prompt: 'Provide a name for the Apex Script',
            ignoreFocusOut: true
        };
        let inputBoxPromise = vscode.window.showInputBox(inputBoxOptions).then((apexScriptName) => {
            if(apexScriptName && apexScriptName.length > 0){
                this.body.name = apexScriptName;
                return super.execute();
            }
        });
        return inputBoxPromise;
    }
}