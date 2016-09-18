'use strict';
import * as vscode from 'vscode';
import request = require('request-promise');
import urlJoin = require('url-join');
import Promise = require('bluebird');
import Command from './command';
import { ClientCommandInterface } from './commands/clientCommandInterface';
import { hasProjectSettings, ProjectSettings } from './projectSettings';
import { MavensMateStatus } from '../vscode/mavensMateStatus';

let mavensMateStatus = MavensMateStatus.getInstance();

export interface Options {
    baseURL: string;
    projectId?: string;
}

export class MavensMateClient{
    options: Options;
    
    private static _instance: MavensMateClient = null;

    static getInstance(){
        if(MavensMateClient._instance == null){
            let options: Options = {
                baseURL: vscode.workspace.getConfiguration().get<string>('mavensMateDesktop.baseURL')
            }
            
            let projectSettings = ProjectSettings.getProjectSettings();
            if(projectSettings){
                options.projectId = projectSettings.id;
            }
                
            MavensMateClient._instance = new MavensMateClient(options);
        }
        return MavensMateClient._instance;
    }
    
    constructor(options: Options){
        this.options = options;
    }
    
    isAppAvailable(){
        let isAvailableURL = urlJoin(this.options.baseURL, '/app/home/index');
        let getOptions = {
            uri: isAvailableURL
        };
        return request.get(getOptions).then(function () { return true });
    }
    
    sendCommand(command: ClientCommandInterface) : Promise<any> {
        let postOptions = this.getPostOptionsForCommand(command, this.options.baseURL);
        let promiseCommandSend = request(postOptions).promise();
        mavensMateStatus.showAppIsThinking();
        if(command.async){
            return promiseCommandSend.bind(this).then(this.handlePollResponse);
        } else {
            return promiseCommandSend;
        }
    }

    private getPostOptionsForCommand(command: ClientCommandInterface, baseURL: string){
        let asyncParam: number = (command.async ? 1 : 0);
        
        let commandParmeters = 'command=' + command.id +'&async=' + asyncParam;

        if(this.hasProjectId()){
            commandParmeters += '&pid=' + this.options.projectId; 
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
        if(commandResponse.status && commandResponse.status == 'pending'){
            mavensMateStatus.showAppIsThinking();
            return Promise.delay(500, commandResponse)
                .bind(this)
                .then(this.poll)
                .then(this.handlePollResponse);
        } else {
            return commandResponse;
        }
    }

    poll(commandResponse){
        let statusURL = urlJoin(this.options.baseURL, '/execute/' + commandResponse.id);
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
        return this.options.projectId && this.options.projectId != '';
    }
}