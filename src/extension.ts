'use strict';
import * as vscode from 'vscode';

import { MavensMateClient } from '../src/mavensmate/mavensMateClient';
import { MavensMateStatus } from '../src/vscode/mavensMateStatus';
import { showProjectQuickPick, openProject } from '../src/vscode/projectQuickPick';
import mavensMateCommands = require('../src/mavensmate/mavensMateCommands');

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

    for(let command in mavensMateCommands){
        let mavensMateCommand = mavensMateCommands[command].mavensmate;
        let commandRegistration = registerCommand(command, () => {
            mavensMateStatus.commandStarted();
            return mavensMateClient.sendCommand(mavensMateCommand).then(() => {
                return mavensMateStatus.commandStopped(false);
            }, (error) => {
                return mavensMateStatus.commandStopped(true);
            });
        });
        context.subscriptions.push(commandRegistration);
    }

    context.subscriptions.push(openProject);
}

function showProjectListAndOpen(){
    return showProjectQuickPick().then(openProject);
}

export function deactivate() {
}