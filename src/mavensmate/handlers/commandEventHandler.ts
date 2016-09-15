import { MavensMateChannel } from '../../vscode/mavensMateChannel';
import { Disposable } from 'vscode';
import Command from '../command';
import Promise = require('bluebird');

export class CommandEventHandler implements Disposable {
    channel: MavensMateChannel;

    static Create(channel: MavensMateChannel){
        return new CommandEventHandler(channel);
    }

    constructor(channel: MavensMateChannel){
        this.channel = channel;
    }

    onStart(command: Command): Promise<any> {
        this.channel.waitingOnCount++;
        return Promise.resolve().then(() => {
            let statusText: string = command.name + ': Starting';
            return this.channel.appendStatus(statusText);
        });
    }

    onSuccess(command: Command, response): Promise<any>{
        return this.commandStopped(command, response);
    }

    onError(command: Command, response): Promise<any>{
        return this.commandStopped(command, response);
    }

    private commandStopped(command: Command, response): Promise<any> {
        this.channel.waitingOnCount--;

        return Promise.resolve().then(() => {
            if(response.error){
                this.channel.appendError(command.name + ': ' + response.error + '\n' + response.stack);
            } else {
                return this.channel.appendStatus(command.name + 'Done');
            }
            
        });
    }

    dispose(){
        this.channel.dispose();
    }
} 