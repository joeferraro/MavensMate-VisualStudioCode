'use strict';
import * as vscode from 'vscode';
import Promise = require('bluebird');

import { MavensMateChannel } from '../src/vscode/mavensMateChannel';
import { hasProjectSettings, ProjectSettings } from '../src/mavensmate/projectSettings';
import { MavensMateStatus } from '../src/vscode/mavensMateStatus';
import * as CommandRegistrar from '../src/vscode/commandRegistrar';

let mavensMateChannel: MavensMateChannel = MavensMateChannel.getInstance();
let mavensMateStatus: MavensMateStatus = MavensMateStatus.getInstance();

let languagesToCompileOnSave = new Set<string>(['apex', 'visualforce', 'metadata', 'xml', 'javascript']);

export class MavensMateExtension {
    context: vscode.ExtensionContext;

    constructor(context: vscode.ExtensionContext){
        this.context = context;
    }

    activate(context: vscode.ExtensionContext) {
        mavensMateChannel.appendStatus('MavensMate is activating');

        return Promise.resolve().bind(this)
            .then(() => {
                return hasProjectSettings();
            })
            .then(this.instantiateWithProject, this.instantiateWithoutProject)
            .then(this.subscribeToEvents)
            .then(this.activateMavensMate);
    }

    instantiateWithProject(){
        let projectSettings = ProjectSettings.getProjectSettings();
        mavensMateChannel.appendStatus(`Instantiating with Project: ${projectSettings.project_name} (${ projectSettings.instanceUrl })`);
    }

    instantiateWithoutProject(){
        mavensMateChannel.appendStatus(`Instantiating without Project`);
    }

    subscribeToEvents(){
        let saveEvent = vscode.workspace.onDidSaveTextDocument((textDocument) => {
            if(languagesToCompileOnSave.has(textDocument.languageId)){
                vscode.commands.executeCommand('mavensmate.compileFile', textDocument.uri);
            }
        });
        this.context.subscriptions.push(saveEvent);

        mavensMateChannel.appendStatus('Subscribed to events');
    }

    activateMavensMate(){
        CommandRegistrar.registerCommands(this.context);
        mavensMateChannel.appendStatus('Commands registered');
        return mavensMateStatus.updateAppStatus();
    }

    deactivate() {
        mavensMateChannel.appendStatus('Deactivating');
        mavensMateChannel.dispose();
    }
}