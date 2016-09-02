'use strict';
import * as vscode from 'vscode';

import { MavensMateClient, Options } from '../src/mavensmate/mavensMateClient';
import { MavensMateStatus } from '../src/vscode/mavensMateStatus';
import { ClientStatus } from '../src/vscode/clientStatus';
import { MavensMateChannel } from '../src/vscode/mavensMateChannel';
import { CommandRegistrar } from '../src/vscode/commandRegistrar';
import { hasProjectSettings, getProjectSettings } from '../src/mavensmate/projectSettings';
import ClientCommandEventHandler from '../src/mavensmate/ClientCommandEventHandler';

let mavensMateClientOptions: Options = {
    baseURL: 'http://localhost:56248'
};

let mavensMateClient: MavensMateClient;
let mavensMateStatus: MavensMateStatus;
let commandRegistrar: CommandRegistrar;
let mavensMateContext: vscode.ExtensionContext;
let mavensMateChannel: MavensMateChannel;
let clientStatus: ClientStatus;

export function activate(context: vscode.ExtensionContext) {
    mavensMateContext = context;
    mavensMateChannel = MavensMateChannel.Create();

    mavensMateChannel.appendLine('MavensMate is activating');

    return hasProjectSettings()
        .then(instantiateWithProject, instantiate)
        .then(subscribeToEvents)
        .then(activateMavensMate);
}

function instantiateWithProject(){
    let projectSettings = getProjectSettings();
    mavensMateClientOptions.projectId = projectSettings.id;
    mavensMateChannel.appendLine('Initializing with project Id: ' + projectSettings.id);
    instantiate();
}

function instantiate(){
    mavensMateChannel.appendLine('Initializing');
    mavensMateClient = MavensMateClient.Create(mavensMateClientOptions);
    mavensMateStatus = MavensMateStatus.Create(mavensMateClient);
    clientStatus = ClientStatus.Create();

    let eventHandlers = instantiateClientCommandHandlers();

    commandRegistrar = CommandRegistrar.Create(mavensMateClient, mavensMateContext, eventHandlers);

    mavensMateContext.subscriptions.push.apply(eventHandlers);
}

function instantiateClientCommandHandlers(){
    let eventHandlers: ClientCommandEventHandler[] = [];

    eventHandlers.push(clientStatus);
    eventHandlers.push(mavensMateChannel);

    return eventHandlers;
}

function activateMavensMate(){
    commandRegistrar.registerCommands();
    mavensMateChannel.appendLine('Commands registered');
    return mavensMateStatus.updateAppStatus();
}

function subscribeToEvents(){
    let saveEvent = vscode.workspace.onDidSaveTextDocument((textDocument) => {
        vscode.commands.executeCommand('mavensmate.compileFile', textDocument.uri);
    });
    mavensMateContext.subscriptions.push(saveEvent);

    mavensMateChannel.appendLine('Subscribed to events');
}


export function deactivate() {
    mavensMateChannel.appendLine('Deactivating');
}