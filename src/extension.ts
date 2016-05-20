'use strict';
import * as vscode from 'vscode';

import { MavensMateClient } from '../src/mavensmate/mavensMateClient';
import { MavensMateStatus } from '../src/vscode/mavensMateStatus';
import { showProjectQuickPick, openProject } from '../src/vscode/projectQuickPick';

let mavensMateClientOptions = {
    baseURL: 'http://localhost:56248'
}; 

export function activate(context: vscode.ExtensionContext) {
    console.log('MavensMate is activating');
    let mavensMateClient = MavensMateClient.Create(mavensMateClientOptions);
    let mavensMateStatus = MavensMateStatus.Create(mavensMateClient);
    
    mavensMateStatus.updateAppStatus();

    let disposable = vscode.commands.registerCommand('mavensmate.openProject', () => {
        showProjectQuickPick().then(openProject);
    });

    context.subscriptions.push(disposable);
}

export function deactivate() {
}