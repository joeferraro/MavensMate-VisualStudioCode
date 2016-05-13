'use strict';
import * as request from 'request-promise';
import * as urlJoin from 'url-join';

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
}