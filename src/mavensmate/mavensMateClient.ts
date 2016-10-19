'use strict';
import * as vscode from 'vscode';
import request = require('request-promise');
import urlJoin = require('url-join');
import Promise = require('bluebird');
import { ClientCommand } from './commands/clientCommand';
import { hasProjectSettings, ProjectSettings } from './projectSettings';
import { MavensMateStatus } from '../vscode/mavensMateStatus';

export interface Options {
    baseURL: string;
    projectId?: string;
}

export class MavensMateClient implements vscode.Disposable {
    baseURL: string;
    projectId: string;
    mavensMateStatus: MavensMateStatus;
    
    private static _instance: MavensMateClient = null;

    static getInstance(){
        if(MavensMateClient._instance == null){
            MavensMateClient._instance = new MavensMateClient();
        }
        return MavensMateClient._instance;
    }
    
    constructor(){
        this.baseURL = vscode.workspace.getConfiguration().get<string>('mavensMateDesktop.baseURL');
        this.mavensMateStatus = MavensMateStatus.getInstance();
    
        let projectSettings = ProjectSettings.getProjectSettings();
        if(projectSettings){
            this.projectId = projectSettings.id;
        }
    }
    
    isAppAvailable(){
        let isAvailableURL = urlJoin(this.baseURL, '/app/home/index');
        let getOptions = {
            uri: isAvailableURL
        };
        return request.get(getOptions).then(() => {
            this.mavensMateStatus.showAppIsAvailable();
        }, () => {
            this.mavensMateStatus.showAppIsUnavailable();
        });
    }
    
    sendCommand(command: ClientCommand) : Promise<any> {
        let postOptions = this.getPostOptionsForCommand(command, this.baseURL);
        let promiseCommandSend = request(postOptions).promise();
        this.mavensMateStatus.showAppIsThinking();
        if(command.async){
            return promiseCommandSend.bind(this).then(this.handlePollResponse);
        } else {
            return promiseCommandSend;
        }
    }

    private getPostOptionsForCommand(command: ClientCommand, baseURL: string){
        let asyncParam: number = (command.async ? 1 : 0);
        
        let commandParmeters = 'command=' + command.id +'&async=' + asyncParam;

        if(this.hasProjectId()){
            commandParmeters += '&pid=' + this.projectId; 
        }
        let commandURL = urlJoin(baseURL, '/execute?' + commandParmeters);
        let commandHeaders = {
            'Content-Type': 'application/json',
            'MavensMate-Editor-Agent': 'vscode'
        };
        
        let postOptions = {
            method: 'POST',
            uri: commandURL,
            headers: commandHeaders,
            body: command.body,
            json: true
        };
        return postOptions;
    }

    handlePollResponse(commandResponse){
        console.log(commandResponse);
        if(commandResponse.status && commandResponse.status == 'pending'){
            this.mavensMateStatus.showAppIsThinking();
            return Promise.delay(500, commandResponse)
                .bind(this)
                .then(this.poll)
                .then(this.handlePollResponse);
        } else {
            return commandResponse;
        }
    }

    poll(commandResponse){
        let statusURL = urlJoin(this.baseURL, '/execute/' + commandResponse.id);
        let statusHeaders = {
            'MavensMate-Editor-Agent': 'vscode'
        };

        let getOptions = {
            method: 'GET',
            uri: statusURL,
            headers: statusHeaders,
            json: true
        };
        
        return request(getOptions);
    }

    private hasProjectId(){
        return this.projectId && this.projectId != '';
    }

    dispose(){
        
    }
}