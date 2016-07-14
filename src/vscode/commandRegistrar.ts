import { MavensMateClient } from '../../src/mavensmate/mavensMateClient';
import { MavensMateStatus } from '../../src/vscode/mavensMateStatus';
import ProjectQuickPick = require('../../src/vscode/projectQuickPick');
import ClientCommands = require('../../src/mavensmate/clientCommands');
import { CommandInvoker } from '../../src/mavensmate/commandInvoker';
import vscode = require('vscode');


interface ClientCommand {
    command: string,
    async: boolean,
    body: {
        args: any
    }
}

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

    private registerClientCommand(commandKey: string, clientCommand: any){
        let registerCommand = vscode.commands.registerCommand;
        let commandInvoker = CommandInvoker.Create(this.client, this.status, clientCommand);

        let commandRegistration = registerCommand(commandKey, commandInvoker.invokeProxy);
        this.context.subscriptions.push(commandRegistration);
        
    }

    private registerLocalCommands(){
        let registerCommand = vscode.commands.registerCommand;
        
        let openProject = registerCommand('mavensmate.openProject', ProjectQuickPick.showProjectListAndOpen);
        this.context.subscriptions.push(openProject);
    }
}