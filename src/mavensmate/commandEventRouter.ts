import { CommandEventHandler } from './commandEventHandler';
import { MavensMateChannel } from '../vscode/mavensMateChannel';
import Command from './command';
import { Disposable } from 'vscode';

export class CommandEventRouter implements Disposable {
    defaultHandler: CommandEventHandler;

    static Create(channel: MavensMateChannel){
        return new CommandEventRouter(channel);
    }

    constructor(channel: MavensMateChannel){
        this.initializeHandlers(channel);
    }

    private initializeHandlers(channel: MavensMateChannel){
        this.defaultHandler = CommandEventHandler.Create(channel);
    }

    onStart(command: Command) {
        return this.defaultHandler.onStart(command);
    }

    onSuccess(command: Command, result){
        return this.defaultHandler.onSuccess(command, result);
    }

    onError(command: Command, result){
        return this.defaultHandler.onError(command, result);
    }

    dispose(){
        this.defaultHandler.dispose();
    }
}