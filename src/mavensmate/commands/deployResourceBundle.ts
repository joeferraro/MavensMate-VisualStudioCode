import { PathsCommand } from './pathsCommand';
import ResourceBundleQuickPick = require('../../vscode/resourceBundleQuickPick');

import * as vscode from 'vscode';
import Promise = require('bluebird');

class DeployResourceBundle extends PathsCommand {
    static create(): PathsCommand{
        return new DeployResourceBundle();
    }

    constructor() {
        super('Resource Bundle', 'deploy-resource-bundle');
    }

    execute(selectedResource?: vscode.Uri): Thenable<any> {
        return ResourceBundleQuickPick.showResourceBundleQuickPick()
            .then((selectedResourceBundle: ResourceBundleQuickPick.resourceBundleQuickPickItem) => {
                let selectedResource: vscode.Uri = vscode.Uri.file(selectedResourceBundle.path);
                return super.execute(selectedResource);
            });
    }
}
export = DeployResourceBundle;