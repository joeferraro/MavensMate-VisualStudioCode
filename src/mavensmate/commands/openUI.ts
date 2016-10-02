import { ClientCommand } from './clientCommand';
import { BaseCommand } from './baseCommand';
import * as vscode from 'vscode';

class OpenUI extends ClientCommand {
    static allowWithoutProject: boolean = true;
    static create(): BaseCommand {
        return new OpenUI();
    }

    constructor() {
        super('Open UI', 'open-ui');
        this.async = false;
        this.body.args.ui = true;
    }

    onSuccess(response) {
        return super.onSuccess(response)
            .then(() => {
                vscode.window.showInformationMessage('DREAMFORCE IS AMAZING');
                return response;
            });
    }
}

export = OpenUI;