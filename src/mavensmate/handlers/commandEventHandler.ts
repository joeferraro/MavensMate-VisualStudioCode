import { MavensMateChannel } from '../../vscode/mavensMateChannel';
import { Disposable } from 'vscode';
import Command from '../command';

export class CommandEventHandler implements Disposable {
    channel: MavensMateChannel;

    static Create(channel: MavensMateChannel){
        return new CommandEventHandler(channel);
    }

    constructor(channel: MavensMateChannel){
        this.channel = channel;
    }

    onStart(command: Command) {
        this.channel.waitingOnCount++;
        return Promise.resolve().then(() => {
            let statusText: string = command.name + ': Starting';
            return this.channel.appendStatus(statusText);
        });
    }

    onSuccess(command: Command, result){
        return this.commandStopped(command, result);
    }

    onError(command: Command, result){
        return this.commandStopped(command, result);
    }

    private commandStopped(command: Command, result) {
        this.channel.waitingOnCount--;

        return Promise.resolve().then(() => {
            let statusText: string;
            if(result.statusCode > 200){
                statusText = command.name + ': Error';
            } else {
                statusText = command.name + ': Success';
            }
            return this.channel.appendStatus(statusText);
        });
    }

    dispose(){
        this.channel.dispose();
    }
} 