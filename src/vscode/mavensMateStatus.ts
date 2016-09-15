'use strict';
import { window, StatusBarAlignment, StatusBarItem } from 'vscode';
import { MavensMateClient } from '../../src/mavensmate/mavensMateClient';
import { MavensMateChannel } from '../../src/vscode/mavensMateChannel';
import Promise = require('bluebird');

export class MavensMateStatus {
    appStatus: StatusBarItem;
    client: MavensMateClient;
    channel: MavensMateChannel;
    
    static Create(client: MavensMateClient, channel: MavensMateChannel){
        return new MavensMateStatus(client, channel);
    }
    
    constructor(client: MavensMateClient, channel: MavensMateChannel){
        this.appStatus = window.createStatusBarItem(StatusBarAlignment.Left);
        this.appStatus.command = 'mavensmate.toggleOutput';
        this.client = client;
        this.channel = channel;
    }
    
    updateAppStatus(){
        return this.client.isAppAvailable()
            .then((isAvailable) =>{
                this.showAppIsAvailable();
                this.channel.appendStatus(`MavensMate Desktop is available`);
            })
            .catch((requestError) => {
                this.showAppIsUnavailable(requestError);
                this.channel.appendError(`Could not contact local MavensMate server, please ensure MavensMate Desktop is installed and running. `);
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
}