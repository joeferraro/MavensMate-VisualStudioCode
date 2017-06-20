'use strict';
import * as vscode from 'vscode';
import axios, { AxiosRequestConfig, AxiosInstance, AxiosPromise } from 'axios';
import urlJoin = require('url-join');
import Promise = require('bluebird');
import { ClientCommand } from './commands/clientCommand';
import { ProjectSettings } from './projectSettings';
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
        let getOptions: AxiosRequestConfig = {
            url: isAvailableURL
        };
        return axios(isAvailableURL).then(() => {
            this.mavensMateStatus.showAppIsAvailable();
        }, () => {
            this.mavensMateStatus.showAppIsUnavailable();
        });
    }
    
    sendCommand(command: ClientCommand) : Promise<any> {
        let postOptions = this.getPostOptionsForCommand(command, this.baseURL);
        let promiseCommandSend = Promise.resolve(axios(postOptions));
        this.mavensMateStatus.showAppIsThinking();
        return promiseCommandSend.bind(this).then(this.handleResponse);
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
        
        let postOptions: AxiosRequestConfig = {
            method: 'POST',
            url: commandURL,
            headers: commandHeaders,
            data: command.body
        };
        return postOptions;
    }

    handleResponse(commandResponse){
        if(commandResponse.data && commandResponse.data.status && commandResponse.data.status == 'pending'){
            this.mavensMateStatus.showAppIsThinking();
            return Promise.delay(500, commandResponse)
                .bind(this)
                .then(this.poll)
                .then(this.handleResponse);
        } else {
            return commandResponse.data;
        }
    }

    poll(commandResponse){
        let statusURL = urlJoin(this.baseURL, '/execute/' + commandResponse.data.id);
        let statusHeaders = {
            'MavensMate-Editor-Agent': 'vscode'
        };

        let getOptions: AxiosRequestConfig = {
            url: statusURL,
            headers: statusHeaders
        };
        
        return axios(getOptions);
    }

    private hasProjectId(){
        return this.projectId && this.projectId != '';
    }

    dispose(){
        
    }
}
