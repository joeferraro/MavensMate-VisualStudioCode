import { MavensMateClient } from '../mavensmate/mavensMateClient';
import ClientCommands = require('../mavensmate/clientCommands');
import { CommandEventRouter } from '../mavensmate/commandEventRouter';
import { ClientCommandInvoker } from '../mavensmate/clientCommandInvoker';
import { CommandInvoker } from '../mavensmate/commandInvoker';
import Command from '../mavensmate/command';
import { MavensMateChannel } from './mavensMateChannel';
import vscode = require('vscode');
import commandIndex = require('../mavensmate/commands/index');

export class CommandRegistrar {
    client: MavensMateClient;
    context: vscode.ExtensionContext;
    channel: MavensMateChannel;
    commandEventRouter: CommandEventRouter;
    commandInvokers: CommandInvoker[];

    static Create(client: MavensMateClient, context: vscode.ExtensionContext, 
        channel: MavensMateChannel, commandEventRouter: CommandEventRouter){
        return new CommandRegistrar(client, context, channel, commandEventRouter);
    }

    constructor(client: MavensMateClient, context: vscode.ExtensionContext, 
        channel: MavensMateChannel, commandEventRouter: CommandEventRouter){
        this.client = client;
        this.context = context;
        this.channel = channel;
        this.commandEventRouter = commandEventRouter;
        this.commandInvokers = [];
    }

    registerCommands(){
        let registerCommand = vscode.commands.registerCommand;

        let commandDirectory = commandIndex.commandDirectory();

        for(let commandKey in commandDirectory){
            let buildCommand = commandDirectory[commandKey];
            let commandInvoker = CommandInvoker.Create(buildCommand, this.client, this.channel);
            
            registerCommand(commandKey, commandInvoker.invokeProxy);
        }

        this.registerClientCommands();
    }

    private registerClientCommands(){
        let commands = ClientCommands.list();
        
        for(let commandKey in commands){
            let clientCommand = commands[commandKey];
            this.registerClientCommand(commandKey, clientCommand);
        }
    }

    private registerClientCommand(commandKey: string, clientCommand: Command){
        let registerCommand = vscode.commands.registerCommand;
        let registerTextEditorCommand = vscode.commands.registerTextEditorCommand;        
        let commandInvoker = ClientCommandInvoker.Create(this.client, clientCommand, this.commandEventRouter);
        let commandRegistration: vscode.Disposable;
        
        if(clientCommand.currentTextDocument){
            commandRegistration = registerTextEditorCommand(commandKey, commandInvoker.invokeTextEditorProxy);
        } else {
            commandRegistration = registerCommand(commandKey, commandInvoker.invokeProxy);
        }
        this.context.subscriptions.push(commandRegistration);
        
    }
}