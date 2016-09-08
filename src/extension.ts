'use strict';
import * as vscode from 'vscode';

import { MavensMateClient, Options } from '../src/mavensmate/mavensMateClient';
import { CommandEventRouter } from '../src/mavensmate/commandEventRouter';
import { MavensMateStatus } from '../src/vscode/mavensMateStatus';
import { ClientStatus } from '../src/vscode/clientStatus';
import { MavensMateChannel } from '../src/vscode/mavensMateChannel';
import { CommandRegistrar } from '../src/vscode/commandRegistrar';
import { hasProjectSettings, getProjectSettings } from '../src/mavensmate/projectSettings';
import ClientCommandEventHandler from '../src/mavensmate/ClientCommandEventHandler';

let mavensMateClientOptions: Options;

let mavensMateClient: MavensMateClient;
let mavensMateStatus: MavensMateStatus;
let commandRegistrar: CommandRegistrar;
let mavensMateContext: vscode.ExtensionContext;
let mavensMateChannel: MavensMateChannel;
let commandEventRouter: CommandEventRouter;
let clientStatus: ClientStatus;
let mavensMateConfiguration: vscode.WorkspaceConfiguration;

export function activate(context: vscode.ExtensionContext) {
    mavensMateContext = context;
    mavensMateChannel = MavensMateChannel.Create();

    mavensMateChannel.appendStatus('MavensMate is activating');

    mavensMateConfiguration = vscode.workspace.getConfiguration()
    mavensMateClientOptions = {
        baseURL: mavensMateConfiguration.get<string>('mavensMateDesktop.baseURL')
    };

    return hasProjectSettings()
        .then(instantiateWithProject, instantiate)
        .then(subscribeToEvents)
        .then(activateMavensMate);
}

function instantiateWithProject(){
    let projectSettings = getProjectSettings();
    mavensMateClientOptions.projectId = projectSettings.id;
    mavensMateChannel.appendStatus(`Instantiating with Project: ${projectSettings.project_name} (${ projectSettings.instanceUrl })`);
    instantiate();
}

function instantiate(){
    mavensMateChannel.appendStatus('Instantiating Supporting Extension Elements');
    mavensMateClient = MavensMateClient.Create(mavensMateClientOptions);
    mavensMateStatus = MavensMateStatus.Create(mavensMateClient, mavensMateChannel);
    commandEventRouter = CommandEventRouter.Create(mavensMateChannel);
    clientStatus = ClientStatus.Create();

    commandRegistrar = CommandRegistrar.Create(mavensMateClient, mavensMateContext, 
        mavensMateChannel, commandEventRouter);

    mavensMateContext.subscriptions.push(commandEventRouter);
}

function subscribeToEvents(){
    let saveEvent = vscode.workspace.onDidSaveTextDocument((textDocument) => {
        vscode.commands.executeCommand('mavensmate.compileFile', textDocument.uri);
    });
    mavensMateContext.subscriptions.push(saveEvent);

    mavensMateChannel.appendStatus('Subscribed to events');
}

function activateMavensMate(){
    commandRegistrar.registerCommands();
    mavensMateChannel.appendStatus('Commands registered');
    return mavensMateStatus.updateAppStatus();
}

export function deactivate() {
    mavensMateChannel.appendStatus('Deactivating');
}