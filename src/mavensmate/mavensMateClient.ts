'use strict';
import * as request from 'request-promise';
import * as urlJoin from 'url-join';
import Promise = require('bluebird');

export interface Options {
    baseURL: string;
}

export interface Command {
    command: string;
    async: boolean;
    args: {
        ui: boolean;
    }
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
        let commandBody = {
            args: command.args
        }
        let asyncParam: number = (command.async ? 1 : 0);
        
        let commandParmeters = 'command=' + command.command +'&async=' + asyncParam;
        let commandURL = urlJoin(this.options.baseURL, '/execute?' + commandParmeters);
        let commandHeaders = {
            'Content-Type': 'application/json',
            'MavensMate-Editor-Agent': 'vscode'
        };
        
        let postOptions = {
            method: 'POST',
            uri: commandURL,
            headers: commandHeaders,
            body: commandBody,
            json: true
        };
        
        return request(postOptions);
    }
}