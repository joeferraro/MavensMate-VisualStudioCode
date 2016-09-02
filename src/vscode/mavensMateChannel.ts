'use strict';
import { window, OutputChannel, Disposable } from 'vscode';
import { MavensMateClient } from '../../src/mavensmate/mavensMateClient';
import ClientCommandEventHandler from '../../src/mavensmate/clientCommandEventHandler';
import Command from '../../src/mavensmate/command';
import Promise = require('bluebird');

export class MavensMateChannel implements ClientCommandEventHandler {
    channel: OutputChannel;
    waitingOnCount: number;
    
    static Create(){
        return new MavensMateChannel();
    }
    
    constructor(){
        this.channel = window.createOutputChannel('MavensMate');
        this.waitingOnCount = 0;
    }

    onStart(command: Command) {
        return Promise.resolve().then(() => {
            this.waitingOnCount++;
            let statusText: string = command.command + ': Starting';
            if(command.body.paths){
                statusText += ' ' + command.body.paths;
            }
            return this.appendLine(statusText);
        });
    }

    onSuccess(command: Command, result){
        return this.commandStopped(command, false);
    }

    onError(command: Command, result){
        return this.commandStopped(command, true);
    }

    private commandStopped(command: Command, result) {
        return Promise.resolve().then(() => {
            this.waitingOnCount--;
            let statusText: string;
            if(result.statusCode > 200){
                statusText = command.command + ': Error';
            } else {
                statusText = command.command + ': Success';
            }
            return this.appendLine(statusText);
        });
    }

    appendLine(message){
        return Promise.resolve().then(() => {
            this.channel.appendLine(message);
            this.channel.show();

            if(this.waitingOnCount == 0){
                return Promise.delay(3000).then(() => {
                    this.channel.hide();
                });
            } else {
                return null;
            }
        });
    }

    dispose(){
        this.channel.dispose();
    }
}