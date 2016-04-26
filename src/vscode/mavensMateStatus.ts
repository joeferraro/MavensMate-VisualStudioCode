'use strict';
import { window, StatusBarAlignment, StatusBarItem } from 'vscode';
import { MavensMateClient } from '../../src/mavensmate/client';

export class MavensMateStatus {
    statusBarItem: StatusBarItem;
    client: MavensMateClient;
    
    constructor(client: MavensMateClient){
        this.statusBarItem = window.createStatusBarItem(StatusBarAlignment.Left);
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
        this.statusBarItem.text = "MavensMate $(check)";
        this.statusBarItem.show();
    }
    
    private showAppIsUnavailable(requestError){
        this.statusBarItem.text = "MavensMate $(alert)";
        this.statusBarItem.show();
    }
}