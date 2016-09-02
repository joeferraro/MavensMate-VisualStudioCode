import { MavensMateClient } from '../../src/mavensmate/mavensMateClient';
import vscode = require('vscode');
import Command from './command';
import ClientCommands = require('../mavensmate/clientCommands');
import ClientCommandEventHandler from './clientCommandEventHandler';
import Promise = require('bluebird');

let clientCommands = ClientCommands.list();

export class CommandInvoker {
    client: MavensMateClient;
    eventHandlers: ClientCommandEventHandler[];
    command: Command;
    invokeProxy: (args?: any) => Promise<any>;
    invokeTextEditorProxy: (textEditor: vscode.TextEditor, edit: vscode.TextEditorEdit) => Promise<any>;

    static Create(client: MavensMateClient, command: Command, eventHandlers: ClientCommandEventHandler[]){
        return new CommandInvoker(client, command, eventHandlers);
    }

    constructor(client: MavensMateClient, command: Command, eventHandlers: ClientCommandEventHandler[]){
        this.client = client;
        this.eventHandlers = eventHandlers;
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
        return this.sendCommand(preparedCommand);
    }

    private prepareCommand(commandToPrepare: Command, documentUri: vscode.Uri): Command{
        console.log(documentUri);
        if(documentUri && documentUri.scheme === 'file'){
            this.setCommandPath(this.command, documentUri.fsPath);
        }
        return commandToPrepare;
    }

    private setCommandPath(commandToPrepare: Command, path: string){
        commandToPrepare.body.paths = [path];
    }

    private sendCommand(commandToSend: Command) {        
        this.handleOnStart(commandToSend);
        
        return this.client.sendCommand(this.command).then((result) => {
            return this.handleOnSuccess(this.command, result);
        }, (result) => {
            return this.handleOnError(this.command, result);
        });
    }

    private handleOnStart(command: Command){
        let onStartPromises: Promise<any>[] = [];

        for(let eventHandler of this.eventHandlers){
            onStartPromises.push(eventHandler.onStart(command));
        }

        return Promise.all(onStartPromises);
    }

    private handleOnSuccess(command: Command, result){
        let onSuccessPromises: Promise<any>[] = [];

        for(let eventHandler of this.eventHandlers){
            onSuccessPromises.push(eventHandler.onSuccess(command, result));
        }

        return Promise.all(onSuccessPromises);
    }

    private handleOnError(command: Command, result){
        let onErrorPromises: Promise<any>[] = [];

        for(let eventHandler of this.eventHandlers){
            onErrorPromises.push(eventHandler.onError(command, result));
        }

        return Promise.all(onErrorPromises);
    }


    private sendoAuthProjectCommand(){
        let oauthCommand = ClientCommands.list()['mavensmate.oAuthProject'];
        this.sendCommand(oauthCommand);
    }

    invokeTextEditor(textEditor: vscode.TextEditor, edit: vscode.TextEditorEdit){
        console.log('invokeTextEditor');
        console.log(textEditor);
        console.log(textEditor.document);
        let documentUri: vscode.Uri = textEditor.document.uri;
        return this.invoke(documentUri);
    }
}