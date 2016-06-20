'use strict';
import * as vscode from 'vscode';

import { MavensMateClient } from '../src/mavensmate/mavensMateClient';
import { MavensMateStatus } from '../src/vscode/mavensMateStatus';
import { showProjectQuickPick, openProject } from '../src/vscode/projectQuickPick';

let mavensMateClientOptions = {
    baseURL: 'http://localhost:56248'
}; 

let registerCommand = vscode.commands.registerCommand;

export function activate(context: vscode.ExtensionContext) {
    console.log('MavensMate is activating');
    let mavensMateClient = MavensMateClient.Create(mavensMateClientOptions);
    let mavensMateStatus = MavensMateStatus.Create(mavensMateClient);
    
    mavensMateStatus.updateAppStatus();

    let openProject = registerCommand('mavensmate.openProject', showProjectListAndOpen);
    let openMavensMateUI = registerCommand('mavensmate.openUI', () => {
        let openUICommand = {
            command: "open-ui",
            async: true,
            body:{
                args: {
                    ui: true
                }
            }
        };
        mavensMateClient.sendCommand(openUICommand);
    });

    context.subscriptions.push(openProject);
}

function showProjectListAndOpen(){
    showProjectQuickPick().then(openProject);
}

export function deactivate() {
}