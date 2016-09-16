import { MavensMateClient } from '../../src/mavensmate/mavensMateClient';
import vscode = require('vscode');
import { MavensMateChannel } from '../vscode/mavensMateChannel';
import Promise = require('bluebird');
import { BaseCommand } from './commands/baseCommand';

export class CommandInvoker {
    buildCommand: (outputChannel: MavensMateChannel) => BaseCommand;
    client: MavensMateClient;
    outputChannel: MavensMateChannel;
    invokeProxy: (args?: any) => Promise<any>;
    invokeTextEditorProxy: (textEditor: vscode.TextEditor, edit: vscode.TextEditorEdit) => Promise<any>;

    static Create(buildCommand: (outputChannel: MavensMateChannel) => BaseCommand, client: MavensMateClient, outputChannel: MavensMateChannel){
        return new CommandInvoker(buildCommand, client, outputChannel);
    }

    constructor(buildCommand: (outputChannel: MavensMateChannel) => BaseCommand, client: MavensMateClient, outputChannel: MavensMateChannel){
        this.client = client;
        this.buildCommand = buildCommand;
        this.outputChannel = outputChannel;
        this.invokeProxy = (selectedResource?: vscode.Uri) => {
            return this.invoke.apply(this, [selectedResource]); 
        }
        this.invokeTextEditorProxy = (textEditor: vscode.TextEditor, edit: vscode.TextEditorEdit) => { 
            return this.invokeTextEditor.apply(this, [textEditor, edit]); 
        }
    }

    invoke(selectedResource?: vscode.Uri){
        let command = this.buildCommand(this.outputChannel);
        return command.execute();
    }

    invokeTextEditor(textEditor: vscode.TextEditor, edit: vscode.TextEditorEdit){
        let command = this.buildCommand(this.outputChannel);
        return command.execute();
    }
}