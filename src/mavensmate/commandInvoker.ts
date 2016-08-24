import { MavensMateClient } from '../../src/mavensmate/mavensMateClient';
import { MavensMateStatus } from '../../src/vscode/mavensMateStatus';
import vscode = require('vscode');
import Command from './command';

export class CommandInvoker {
    client: MavensMateClient;
    status: MavensMateStatus;
    command: Command;
    invokeProxy: (args?: any) => Promise<any>;
    invokeTextEditorProxy: (textEditor: vscode.TextEditor, edit: vscode.TextEditorEdit) => Promise<any>;

    static Create(client: MavensMateClient, status: MavensMateStatus, command: any){
        return new CommandInvoker(client, status, command);
    }

    constructor(client: MavensMateClient, status: MavensMateStatus, command: any){
        this.client = client;
        this.status = status;
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

    invokeTextEditor(textEditor: vscode.TextEditor, edit: vscode.TextEditorEdit){
        let documentUri: vscode.Uri = textEditor.document.uri;
        let preparedCommand = this.prepareCommand(this.command, documentUri);
        return this.sendCommand(preparedCommand);  
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

    private prepareCommand(commandToPrepare: Command, documentUri: vscode.Uri): Command{
        if(documentUri && documentUri.scheme === 'file'){
            this.setCommandPath(this.command, documentUri.fsPath);
        }
        return commandToPrepare;
    }

    private setCommandPath(commandToPrepare: Command, path: string){
        commandToPrepare.body.paths = [path];
    }
}