'use strict';
import { window, StatusBarAlignment, StatusBarItem } from 'vscode';
import { MavensMateClient } from '../../src/mavensmate/mavensMateClient';
import ClientCommandEventHandler from '../../src/mavensmate/clientCommandEventHandler';
import Command from '../../src/mavensmate/command';
import Promise = require('bluebird');

export class ClientStatus implements ClientCommandEventHandler {
    commandStatus: StatusBarItem;
    
    static Create(){
        return new ClientStatus();
    }
    
    constructor(){
        this.commandStatus = window.createStatusBarItem(StatusBarAlignment.Left);
        console.log('constructor');
        console.log(this.commandStatus);
    }

    onStart(command: Command) {
        this.commandStatus.text = "$(squirrel)";
        this.commandStatus.show();

        return Promise.resolve();
    }

    onSuccess(command: Command, result){
        return this.commandStopped(false);
    }

    onError(command: Command, result){
        return this.commandStopped(true);
    }

    private commandStopped(withError: boolean) {
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