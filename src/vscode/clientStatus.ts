'use strict';
import { window, StatusBarAlignment, StatusBarItem } from 'vscode';
import { MavensMateClient } from '../../src/mavensmate/mavensMateClient';
import Command from '../../src/mavensmate/command';
import Promise = require('bluebird');

export class ClientStatus {
    commandStatus: StatusBarItem;
    
    static Create(){
        return new ClientStatus();
    }
    
    constructor(){
        this.commandStatus = window.createStatusBarItem(StatusBarAlignment.Left);
    }

    onStart(command: Command) {
        return Promise.resolve().then(() => {
            this.commandStatus.text = "$(squirrel)";
            this.commandStatus.show();
        });
    }

    onSuccess(command: Command, result){
        return this.commandStopped(false);
    }

    onError(command: Command, result){
        return this.commandStopped(true);
    }

    private commandStopped(withError: boolean) {
        return Promise.resolve().then(() => {
            let statusText: string;
            if(withError){
                statusText = "$(thumbsdown)";
            } else {
                statusText = "$(thumbsup)";
            }
            this.commandStatus.text = statusText;
            this.commandStatus.show();
        }).delay(3000).then(() => {
            this.commandStatus.hide();
        });
    }

    dispose(){
        this.commandStatus.dispose();
    }
}