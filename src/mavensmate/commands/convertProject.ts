import { ClientCommand } from './clientCommand';
import { BaseCommand } from './baseCommand';
import * as vscode from 'vscode';

module.exports = class NewProjectFromExistingDirectory extends ClientCommand {
    static create(): BaseCommand {
        return new NewProjectFromExistingDirectory();
    }

    constructor() {
        super('Convert To MavensMate Project', 'new-project-from-existing-directory');
        this.async = false;
        this.body.args.ui = true;
        this.body.args.origin = vscode.workspace.rootPath;
        this.allowWithoutProject = true;
    }
}