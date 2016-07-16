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

    isTextEditorCommand(){
        return this.command.paths && this.command.paths == 'active';
    }

    invoke(){
        this.status.commandStarted();
        return this.client.sendCommand(this.command).then(() => {
            let withError = false;
            return this.status.commandStopped(withError);
        }, (error) => {
            let withError = true;
            return this.status.commandStopped(withError);
        });
    }

    invokeTextEditor(textEditor: vscode.TextEditor, edit: vscode.TextEditorEdit){
        this.status.commandStarted();

        let preparedCommand = this.prepareCommand(this.command, textEditor);

        return this.sendCommand(this.command);
    }

    private sendCommand(commandToSend: Command) {
        console.log(this.command);
        
        return this.client.sendCommand(this.command).then((result) => {
            console.log(result);
            let withError = false;
            return this.status.commandStopped(withError);
        }, (error) => {
            let withError = true;
            return this.status.commandStopped(withError);
        });
    }

    private prepareCommand(commandToPrepare: Command, textEditor: vscode.TextEditor): Command{
        if(commandToPrepare.paths == 'active'){
            commandToPrepare.body.paths = [textEditor.document.fileName];
        }
        return commandToPrepare;
    }
}