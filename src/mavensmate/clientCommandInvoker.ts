import { MavensMateClient } from '../../src/mavensmate/mavensMateClient';
import vscode = require('vscode');
import Command from './command';
import ClientCommands = require('../mavensmate/clientCommands');
import { CommandEventRouter } from './commandEventRouter';
import Promise = require('bluebird');
import path = require('path');

let clientCommands = ClientCommands.list();

export class ClientCommandInvoker {
    client: MavensMateClient;
    commandEventRouter: CommandEventRouter;
    command: Command;
    invokeProxy: (args?: any) => Promise<any>;
    invokeTextEditorProxy: (textEditor: vscode.TextEditor, edit: vscode.TextEditorEdit) => Promise<any>;

    static Create(client: MavensMateClient, command: Command, commandEventRouter: CommandEventRouter){
        return new ClientCommandInvoker(client, command, commandEventRouter);
    }

    constructor(client: MavensMateClient, command: Command, commandEventRouter: CommandEventRouter){
        this.client = client;
        this.commandEventRouter = commandEventRouter;
        this.command = command;
        this.invokeProxy = (selectedResource?: vscode.Uri) => {
            return this.invoke.apply(this, [selectedResource]); 
        }
        this.invokeTextEditorProxy = (textEditor: vscode.TextEditor, edit: vscode.TextEditorEdit) => { 
            return this.invokeTextEditor.apply(this, [textEditor, edit]); 
        }
    }

    invoke(selectedResource?: vscode.Uri){
        let preparedCommand = this.prepareCommand(this.command, selectedResource);
        if(this.command.confirm){
            return vscode.window.showInformationMessage(this.command.confirm.message, 'Yes').then((answer) => {
                if(answer === 'Yes'){
                    return this.sendCommand(preparedCommand);
                } else {
                    return;
                }
            });
        } else {
            return this.sendCommand(preparedCommand);
        }
    }

    private prepareCommand(commandToPrepare: Command, documentUri: vscode.Uri): Command{
        if(documentUri && documentUri.scheme === 'file'){
            this.setCommandPath(this.command, documentUri.fsPath);
        }
        if(commandToPrepare.command === 'new-project-from-existing-directory'){
            this.setCommandOrigin(this.command, vscode.workspace.rootPath);
        }
        return commandToPrepare;
    }

    private setCommandPath(commandToPrepare: Command, path: string){
        commandToPrepare.body.paths = [path];
    }

    private setCommandOrigin(commandToPrepare: Command, path: string){
        commandToPrepare.body.args.origin = path;
    }

    private sendCommand(commandToSend: Command) {        
        this.commandEventRouter.onStart(commandToSend);
        
        return this.client.sendCommand(this.command).then((result) => {
            return this.commandEventRouter.onSuccess(this.command, result);
        }, (result) => {
            return this.commandEventRouter.onError(this.command, result);
        });
    }


    private sendoAuthProjectCommand(){
        let oauthCommand = ClientCommands.list()['mavensmate.oAuthProject'];
        this.sendCommand(oauthCommand);
    }

    invokeTextEditor(textEditor: vscode.TextEditor, edit: vscode.TextEditorEdit){
        let documentUri: vscode.Uri = textEditor.document.uri;
        return this.invoke(documentUri);
    }
}