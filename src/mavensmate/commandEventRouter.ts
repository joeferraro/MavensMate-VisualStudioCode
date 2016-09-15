import { CommandEventHandler } from './handlers/commandEventHandler';
import { CompileEventHandler } from './handlers/compileEventHandler';
import { MavensMateChannel } from '../vscode/mavensMateChannel';
import Command from './command';
import { Disposable } from 'vscode';
import Promise = require('bluebird');

export class CommandEventRouter implements Disposable {
    defaultHandler: CommandEventHandler;
    compileHandler: CompileEventHandler;

    static Create(channel: MavensMateChannel){
        return new CommandEventRouter(channel);
    }

    constructor(channel: MavensMateChannel){
        this.initializeHandlers(channel);
    }

    private initializeHandlers(channel: MavensMateChannel){
        this.defaultHandler = CommandEventHandler.Create(channel);
        this.compileHandler = CompileEventHandler.Create(channel);
    }

    onStart(command: Command) {
        let commandHandler = this.getHandler(command);
        return commandHandler.onStart(command).catch(console.error);
    }

    private getHandler(command: Command): CommandEventHandler {
        if(command.command.startsWith('compile-')){
            return this.compileHandler;
        } else {
            return this.defaultHandler;
        }
    }

    onSuccess(command: Command, result){        
        if(result.error){
            this.onError(command, result);
        } else {
            let commandHandler = this.getHandler(command);
            return commandHandler.onSuccess(command, result).catch(console.error);
        }
    }

    onError(command: Command, result){
        return this.defaultHandler.onError(command, result);
    }

    dispose(){
        this.defaultHandler.dispose();
    }
}