import { MavensMateClient } from '../mavensmate/mavensMateClient';
import ProjectQuickPick = require('./projectQuickPick');
import ClientCommands = require('../mavensmate/clientCommands');
import { CommandEventRouter } from '../mavensmate/commandEventRouter';
import { CommandInvoker } from '../mavensmate/commandInvoker';
import Command from '../mavensmate/command';
import { MavensMateChannel } from './mavensMateChannel';
import vscode = require('vscode');

export class CommandRegistrar {
    client: MavensMateClient;
    context: vscode.ExtensionContext;
    channel: MavensMateChannel;
    commandEventRouter: CommandEventRouter;

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
    }

    registerCommands(){
        this.registerClientCommands();
        this.registerLocalCommands();
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
        let commandInvoker = CommandInvoker.Create(this.client, clientCommand, this.commandEventRouter);
        let commandRegistration: vscode.Disposable;
        
        if(clientCommand.currentTextDocument){
            commandRegistration = registerTextEditorCommand(commandKey, commandInvoker.invokeTextEditorProxy);
        } else {
            commandRegistration = registerCommand(commandKey, commandInvoker.invokeProxy);
        }
        this.context.subscriptions.push(commandRegistration);
        
    }

    private registerLocalCommands(){
        let registerCommand = vscode.commands.registerCommand;
        
        let openProject = registerCommand('mavensmate.openProject', ProjectQuickPick.showProjectListAndOpen);
        this.context.subscriptions.push(openProject);

        let toggleChannel = registerCommand('mavensmate.toggleOutput', this.channel.toggle, this.channel);
        this.context.subscriptions.push(toggleChannel);
    }
}