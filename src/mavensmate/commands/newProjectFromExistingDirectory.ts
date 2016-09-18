import { ClientCommand } from './clientCommand';
import { BaseCommand } from './baseCommand';
import * as vscode from 'vscode';

module.exports = class NewProjectFromExistingDirectory extends ClientCommand {
    static allowWithoutProject: boolean = true;
    body: {
        args?: {
            ui: boolean,
            origin?: string
        }
    }
    
    static create(): BaseCommand {
        return new NewProjectFromExistingDirectory();
    }

    constructor() {
        super('Open UI');
        this.id = 'open-ui';
        this.async = false;
        this.body = {
            args: {
                ui: true,
                origin: vscode.workspace.rootPath
            }
        };
    }

    execute(): Thenable<any> {
        return super.execute();
    }
}