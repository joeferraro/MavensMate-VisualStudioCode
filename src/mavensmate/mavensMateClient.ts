'use strict';
import * as request from 'request-promise';
import * as urlJoin from 'url-join';

export class MavensMateClient{
    options: any;
    
    static Create(options: any){
        return new MavensMateClient(options);
    }
    
    constructor(options: any){
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