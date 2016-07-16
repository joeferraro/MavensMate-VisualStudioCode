'use strict';
import * as vscode from 'vscode';

import { MavensMateClient, Options } from '../src/mavensmate/mavensMateClient';
import { MavensMateStatus } from '../src/vscode/mavensMateStatus';
import { CommandRegistrar } from '../src/vscode/commandRegistrar';
import { hasProjectSettings, getProjectSettings } from '../src/mavensmate/projectSettings';

let mavensMateClientOptions: Options = {
    baseURL: 'http://localhost:56248'
};

let mavensMateClient: MavensMateClient;
let mavensMateStatus: MavensMateStatus;
let commandRegistrar: CommandRegistrar;
let mavensMateContext: vscode.ExtensionContext;

export function activate(context: vscode.ExtensionContext) {
    console.log('MavensMate is activating');
    mavensMateContext = context;

    return hasProjectSettings()
        .then(instantiateWithProject, instantiate)
        .then(activateMavensMate);
}

function instantiateWithProject(){
    let projectSettings = getProjectSettings();
    mavensMateClientOptions.projectId = projectSettings.id;
    instantiate();
}

function instantiate(){
    mavensMateClient = MavensMateClient.Create(mavensMateClientOptions);
    mavensMateStatus = MavensMateStatus.Create(mavensMateClient);
    commandRegistrar = CommandRegistrar.Create(mavensMateClient, mavensMateStatus, mavensMateContext);
}

function activateMavensMate(){
    commandRegistrar.registerCommands();
    return mavensMateStatus.updateAppStatus();
}

export function deactivate() {
}