'use strict';
import * as request from 'request-promise';
import * as urlJoin from 'url-join';
import Promise = require('bluebird');

interface Options {
    baseURL: string;
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
    
    sendCommand() : Promise<any> {
        let commandBody = {
            args: {
                ui: true
            }
        }
        
        let commandURL = urlJoin(this.options.baseURL, '/execute?command=open-ui&async=1')
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
        
        console.log('starting request');
        return request(postOptions);
    }
}