'use strict';
import { window, StatusBarAlignment, StatusBarItem } from 'vscode';
import { MavensMateClient } from '../../src/mavensmate/mavensMateClient';
import { MavensMateChannel } from '../../src/vscode/mavensMateChannel';
import Promise = require('bluebird');

let mavensMateChannel = MavensMateChannel.getInstance();
let mavensMateClient = MavensMateClient.getInstance();

export class MavensMateStatus {
    appStatus: StatusBarItem;
    
    private static _instance: MavensMateStatus = null;

    static getInstance(): MavensMateStatus{
        if(MavensMateStatus._instance == null){
            MavensMateStatus._instance = new MavensMateStatus();
        }
        return MavensMateStatus._instance;
    }
    
    constructor(){
        this.appStatus = window.createStatusBarItem(StatusBarAlignment.Left);
        this.appStatus.command = 'mavensmate.toggleOutput';
    }
    
    updateAppStatus(){
        return mavensMateClient.isAppAvailable()
            .then((isAvailable) =>{
                this.showAppIsAvailable();
                mavensMateChannel.appendStatus(`MavensMate Desktop is available`);
            })
            .catch((requestError) => {
                this.showAppIsUnavailable(requestError);
                mavensMateChannel.appendError(`Could not contact local MavensMate server, please ensure MavensMate Desktop is installed and running. `);
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