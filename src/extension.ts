'use strict';
import * as vscode from 'vscode';

import { MavensMateClient } from '../src/mavensmate/mavensMateClient';
import { MavensMateStatus } from '../src/vscode/mavensMateStatus';
import { showProjectListAndOpen } from '../src/vscode/projectQuickPick';
import clientCommands = require('../src/mavensmate/clientCommands');

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

    for(let command in clientCommands){
        let commandRegistration = registerCommand(command, () => {
            let mavensMateCommand = clientCommands[command];
            mavensMateStatus.commandStarted();
            return mavensMateClient.sendCommand(mavensMateCommand).then(() => {
                let withError = false;
                return mavensMateStatus.commandStopped(withError);
            }, (error) => {
                let withError = true;
                return mavensMateStatus.commandStopped(withError);
            });
        });
        context.subscriptions.push(commandRegistration);
    }

    context.subscriptions.push(openProject);
}

export function deactivate() {
}