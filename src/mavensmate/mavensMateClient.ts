'use strict';
import request = require('request-promise');
import urlJoin = require('url-join');
import Promise = require('bluebird');
import Command from './command';

export interface Options {
    baseURL: string;
    projectId?: string;
}

export class MavensMateClient{
    options: Options;
    
    static Create(options: Options){
        return new MavensMateClient(options);
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
    
    sendCommand(command: Command) : Promise<any> {
        let postOptions = this.getPostOptionsForCommand(command, this.options.baseURL);
        let promiseCommandSend = request(postOptions).promise();
        
        if(command.async){
            return promiseCommandSend.bind(this).then(this.handlePollResponse);
        } else {
            return promiseCommandSend;
        }
    }

    private getPostOptionsForCommand(command: Command, baseURL: string){
        let asyncParam: number = (command.async ? 1 : 0);
        
        let commandParmeters = 'command=' + command.command +'&async=' + asyncParam;

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