'use strict';
import * as vscode from 'vscode';

import { MavensMateClient } from '../src/mavensmate/mavensMateClient';
import { MavensMateStatus } from '../src/vscode/mavensMateStatus';
import { CommandRegistrar } from '../src/mavensmate/commandRegistrar';

let mavensMateClientOptions = {
    baseURL: 'http://localhost:56248'
}; 



export function activate(context: vscode.ExtensionContext) {
    console.log('MavensMate is activating');
    let mavensMateClient = MavensMateClient.Create(mavensMateClientOptions);
    let mavensMateStatus = MavensMateStatus.Create(mavensMateClient);
    let commandRegistrar = CommandRegistrar.Create(mavensMateClient, mavensMateStatus, context);

    commandRegistrar.registerCommands();
    mavensMateStatus.updateAppStatus();
}

export function deactivate() {
}