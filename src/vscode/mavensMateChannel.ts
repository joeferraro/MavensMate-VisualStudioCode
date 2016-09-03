'use strict';
import { window, OutputChannel, Disposable } from 'vscode';
import { MavensMateClient } from '../../src/mavensmate/mavensMateClient';
import ClientCommandEventHandler from '../../src/mavensmate/clientCommandEventHandler';
import Command from '../../src/mavensmate/command';
import Promise = require('bluebird');

export class MavensMateChannel implements ClientCommandEventHandler {
    channel: OutputChannel;
    waitingOnCount: number;
    waitingDelay: number;
    isShowing: boolean;
    
    static Create(){
        return new MavensMateChannel();
    }
    
    constructor(){
        this.channel = window.createOutputChannel('MavensMate');
        this.waitingOnCount = 0;
        this.waitingDelay = 5000;
        this.isShowing = false;
    }

    onStart(command: Command) {
        return Promise.resolve().then(() => {
            this.waitingOnCount++;
            let statusText: string = command.command + ': Starting';
            if(command.body.paths){
                statusText += ' ' + command.body.paths;
            }
            return this.appendStatus(statusText);
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
            return this.appendStatus(statusText);
        });
    }

    appendStatus(message: string){
        return this.appendLine('STATUS', message);
    }

    appendError(message: string){
        return this.appendLine('ERROR', message);
    }

    appendLine(level: string, message: string){
        return Promise.resolve().then(() => {
            let tabs = (level.length > 5 ? 1 : 2);
            this.channel.appendLine(`[${level}]${ '\t'.repeat(tabs) }${message}`);
            this.show();

            if(this.waitingOnCount == 0){
                return Promise.delay(this.waitingDelay).then(() => {
                    this.hide();
                });
            } else {
                return null;
            }
        });
    }

    show(){
        this.channel.show();
        this.isShowing = true;
    }

    hide(){
        this.channel.hide();
        this.isShowing = false;
    }

    toggle(): Thenable<any>{
        if(this.isShowing){
            this.hide();
            return Promise.resolve();
        } else {
            this.waitingOnCount++;
            this.show();
            return Promise.delay(this.waitingDelay).then(() => {
                this.waitingOnCount--;
            });
        }
    }

    dispose(){
        this.channel.dispose();
    }
}