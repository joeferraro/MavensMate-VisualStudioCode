import { MavensMateClient } from '../mavensmate/mavensMateClient';
import { MavensMateStatus } from './mavensMateStatus';
import ProjectQuickPick = require('./projectQuickPick');
import ClientCommands = require('../mavensmate/clientCommands');
import { CommandInvoker } from '../mavensmate/commandInvoker';
import Command from '../mavensmate/command';
import vscode = require('vscode');

export class CommandRegistrar {
    client: MavensMateClient;
    status: MavensMateStatus;
    context: vscode.ExtensionContext;

    static Create(client: MavensMateClient, status: MavensMateStatus, context: vscode.ExtensionContext){
        return new CommandRegistrar(client, status, context);
    }

    constructor(client: MavensMateClient, status: MavensMateStatus, context: vscode.ExtensionContext){
        this.client = client;
        this.status = status;
        this.context = context;
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
        let commandInvoker = CommandInvoker.Create(this.client, this.status, clientCommand);

        let commandRegistration: vscode.Disposable;
        
        if(commandInvoker.isTextEditorCommand()){
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
    }
}