import { MavensMateClient } from '../../src/mavensmate/mavensMateClient';
import { MavensMateStatus } from '../../src/vscode/mavensMateStatus';
import vscode = require('vscode');
import Command from './command';

export class CommandInvoker {
    client: MavensMateClient;
    status: MavensMateStatus;
    command: Command;
    invokeProxy: () => Promise<any>;
    invokeTextEditorProxy: (textEditor: vscode.TextEditor, edit: vscode.TextEditorEdit) => Promise<any>;

    static Create(client: MavensMateClient, status: MavensMateStatus, command: any){
        return new CommandInvoker(client, status, command);
    }

    constructor(client: MavensMateClient, status: MavensMateStatus, command: any){
        this.client = client;
        this.status = status;
        this.command = command;
        this.invokeProxy = () => { return this.invoke.apply(this) }
        this.invokeTextEditorProxy = (textEditor: vscode.TextEditor, edit: vscode.TextEditorEdit) => { 
            return this.invokeTextEditor.apply(this, [textEditor, edit]); 
        }
    }

    invoke(){
        return this.sendCommand(this.command);
    }

    invokeTextEditor(textEditor: vscode.TextEditor, edit: vscode.TextEditorEdit){
        let document: vscode.TextDocument = textEditor.document;
        return this.invokeTextDocument(document);
    }

    invokeTextDocument(document: vscode.TextDocument){
        let preparedCommand = this.prepareCommand(this.command, document);
        return this.sendCommand(this.command);   
    }

    private sendCommand(commandToSend: Command) {        
        this.status.commandStarted();

        return this.client.sendCommand(this.command).then((result) => {
            let withError = false;
            return this.status.commandStopped(withError);
        }, (error) => {
            let withError = true;
            return this.status.commandStopped(withError);
        });
    }

    private prepareCommand(commandToPrepare: Command, document: vscode.TextDocument): Command{
        if(commandToPrepare.currentTextDocument){
            commandToPrepare.body.paths = [document.fileName];
        }
        return commandToPrepare;
    }
}