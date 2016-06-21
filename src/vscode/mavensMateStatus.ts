'use strict';
import { window, StatusBarAlignment, StatusBarItem } from 'vscode';
import { MavensMateClient } from '../../src/mavensmate/mavensMateClient';
import Promise = require('bluebird');

export class MavensMateStatus {
    appStatus: StatusBarItem;
    commandStatus: StatusBarItem;
    client: MavensMateClient;
    
    static Create(client: MavensMateClient){
        return new MavensMateStatus(client);
    }
    
    constructor(client: MavensMateClient){
        this.appStatus = window.createStatusBarItem(StatusBarAlignment.Left);
        this.commandStatus = window.createStatusBarItem(StatusBarAlignment.Left);
        this.client = client;
    }
    
    updateAppStatus(){
        return this.client.isAppAvailable()
            .then((isAvailable) =>{
                this.showAppIsAvailable();
            })
            .catch((requestError) => {
                this.showAppIsUnavailable(requestError);
            });
    }
    
    private showAppIsAvailable(){
        this.appStatus.text = "MavensMate $(check)";
        this.appStatus.show();
    }
    
    private showAppIsUnavailable(requestError){
        this.appStatus.text = "MavensMate $(alert)";
        this.appStatus.show();
    }

    commandStarted() {
        this.commandStatus.text = "$(squirrel)";
        this.commandStatus.show();
    }

    commandStopped(withError: boolean) {
        let statusText: string;
        if(withError){
            statusText = "$(thumbsdown)";
        } else {
            statusText = "$(thumbsup)";
        }
        this.commandStatus.text = statusText;
        this.commandStatus.show();
        return Promise.delay(3000).then(() => {
            this.commandStatus.hide();
        });
    }
}