'use strict';
import * as vscode from 'vscode';
import Promise = require('bluebird');

import { MavensMateChannel } from '../src/vscode/mavensMateChannel';
import { hasProjectSettings, ProjectSettings } from '../src/mavensmate/projectSettings';
import { MavensMateClient } from '../src/mavensmate/mavensMateClient';
import { MavensMateStatus } from '../src/vscode/mavensMateStatus';
import * as CommandRegistrar from '../src/vscode/commandRegistrar';

let mavensMateChannel: MavensMateChannel;
let mavensMateStatus: MavensMateStatus;
let mavensMateClient: MavensMateClient;


export class MavensMateExtension {
    context: vscode.ExtensionContext;

    constructor(context: vscode.ExtensionContext){
        this.context = context;
    }

    activate(context: vscode.ExtensionContext) {

        mavensMateChannel = MavensMateChannel.getInstance();
        mavensMateStatus = MavensMateStatus.getInstance();
        mavensMateClient = MavensMateClient.getInstance();
        mavensMateChannel.appendStatus('MavensMate is activating');

        return Promise.resolve().bind(this)
            .then(() => {
                return hasProjectSettings();
            })
            .then(this.instantiateWithProject, this.instantiateWithoutProject)
            .then(this.subscribeToEvents)
            .then(() => {
                mavensMateClient.isAppAvailable();
            });
    }

    instantiateWithProject(){
        let projectSettings = ProjectSettings.getProjectSettings();
        mavensMateChannel.appendStatus(`Instantiating with Project: ${projectSettings.project_name} (${ projectSettings.instanceUrl })`);
        let withProject = true;
        CommandRegistrar.registerCommands(this.context, withProject);
    }

    instantiateWithoutProject(){
        mavensMateChannel.appendStatus(`Instantiating without Project`);
        let withProject = false;
        CommandRegistrar.registerCommands(this.context, withProject);
    }

    subscribeToEvents(){
        let saveEvent = vscode.workspace.onDidSaveTextDocument((textDocument) => {
            vscode.commands.executeCommand('mavensmate.compileFile', textDocument.uri);
        });
        this.context.subscriptions.push(saveEvent);

        mavensMateChannel.appendStatus('Subscribed to events');
    }

    deactivate() {
        mavensMateChannel.appendStatus('Deactivating');
        mavensMateChannel.dispose();
    }
}