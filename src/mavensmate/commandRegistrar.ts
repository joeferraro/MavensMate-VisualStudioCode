import { MavensMateClient } from '../../src/mavensmate/mavensMateClient';
import { MavensMateStatus } from '../../src/vscode/mavensMateStatus';
import { showProjectListAndOpen } from '../../src/vscode/projectQuickPick';
import clientCommands = require('../../src/mavensmate/clientCommands');
import vscode = require('vscode');

let registerCommand = vscode.commands.registerCommand;

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
        for(let command in clientCommands){
            this.registerClientCommand(command);
        }
    }

    private registerClientCommand(command: string){
        let commandRegistration = registerCommand(command, () => {
            let clientCommand = clientCommands[command];
            this.status.commandStarted();
            return this.client.sendCommand(clientCommand).then(() => {
                let withError = false;
                return this.status.commandStopped(withError);
            }, (error) => {
                let withError = true;
                return this.status.commandStopped(withError);
            });
        });
        this.context.subscriptions.push(commandRegistration);
    }

    private registerLocalCommands(){
        let openProject = registerCommand('mavensmate.openProject', showProjectListAndOpen);
        this.context.subscriptions.push(openProject);
    }
}