'use strict';
import * as vscode from 'vscode';
import Promise = require('bluebird');

import { MavensMateChannel } from '../src/vscode/mavensMateChannel';
import { hasProjectSettings, ProjectSettings } from '../src/mavensmate/projectSettings';
import { MavensMateClient } from '../src/mavensmate/mavensMateClient';
import { MavensMateStatus } from '../src/vscode/mavensMateStatus';
import { MavensMateCodeCoverage } from '../src/vscode/mavensMateCodeCoverage';
import * as CommandRegistrar from '../src/vscode/commandRegistrar';
import { getConfiguration } from './vscode/mavensMateConfiguration';


export class MavensMateExtension {
    context: vscode.ExtensionContext;
    mavensMateChannel: MavensMateChannel;
    mavensMateStatus: MavensMateStatus;
    mavensMateClient: MavensMateClient;
    mavensMateCodeCoverage: MavensMateCodeCoverage;

    constructor(context: vscode.ExtensionContext){
        this.context = context;
    }

    activate(context: vscode.ExtensionContext) {

        this.mavensMateChannel = MavensMateChannel.getInstance();
        this.mavensMateStatus = MavensMateStatus.getInstance();
        this.mavensMateClient = MavensMateClient.getInstance();
        this.mavensMateCodeCoverage = MavensMateCodeCoverage.getInstance();
        this.mavensMateChannel.appendStatus('MavensMate is activating');

        return Promise.resolve().bind(this)
            .then(() => {
                return hasProjectSettings();
            })
            .then(this.instantiateWithProject, this.instantiateWithoutProject)
            .then(() => {
                if(getConfiguration<boolean>('mavensMate.pingMavensMateOnStartUp')){
                    this.mavensMateClient.isAppAvailable();
                } else {
                    console.log('Not pinging MavensMate on Startup, controlled by mavensMate.pingMavensMateOnStartUp');
                }
            });
    }

    instantiateWithProject(){
        let projectSettings = ProjectSettings.getProjectSettings();
        this.mavensMateChannel.appendStatus(`Instantiating with Project: ${projectSettings.projectName} (${ projectSettings.instanceUrl })`);
        let withProject = true;
        CommandRegistrar.registerCommands(this.context, withProject);
        return this.subscribeToEvents();
    }

    instantiateWithoutProject(){
        this.mavensMateChannel.appendStatus(`Instantiating without Project`);
        let withProject = false;
        CommandRegistrar.registerCommands(this.context, withProject);
    }

    subscribeToEvents(){
        let saveEvent = vscode.workspace.onDidSaveTextDocument((textDocument) => {
            if(!textDocument.fileName.includes('apex-scripts')){
                return vscode.commands.executeCommand('mavensmate.compileFile', textDocument.uri);
            } else {
                console.info('silently ignoring the saving of a local apex script, ok you got me, this isn\'t necessarily silence');
            }
        });
        this.context.subscriptions.push(saveEvent);

        this.mavensMateChannel.appendStatus('Subscribed to events');
    }

    deactivate() {
        this.mavensMateChannel.appendStatus('Deactivating');
        this.mavensMateChannel.dispose();
        this.mavensMateClient.dispose();
        this.mavensMateStatus.dispose();
        this.mavensMateCodeCoverage.dispose();
        console.info('Finished Deactivating');
    }
}