import { MavensMateChannel } from '../../vscode/mavensMateChannel';

import Promise = require('bluebird');
import * as vscode from 'vscode';
import { ProjectSettings } from '../projectSettings';

interface BaseCommandInterface {
    currentTextDocument?: boolean,
    confirm?: {
        message: string
    }
}

export abstract class BaseCommand implements BaseCommandInterface {
    label: string;
    mavensMateChannel: MavensMateChannel;
    allowWithoutProject: boolean;

    constructor(label: string) {
        this.label = label;

        this.mavensMateChannel = MavensMateChannel.getInstance();
    }

    abstract execute(selectedResource?: vscode.Uri): Thenable<any>;

    invoke(selectedResource?: vscode.Uri): Thenable<any>{
        if(ProjectSettings.hasProjectSettings() || this.allowWithoutProject === true){
            try {
                return this.execute(selectedResource).then(null, this.handleAuthenticationError);
            } catch(commandException){
                this.logAsErrorAndThrow(commandException);
            }
        } else {
            return this.promptToOpenProject();
        }
    }

    private logAsErrorAndThrow(commandException){
        console.error(commandException);
        throw(commandException);
    }

    private handleAuthenticationError(response){
        if(response && response.error && response.error.endsWith('Project requires re-authentication.')){
            console.log('Need to re-authenticate.');
            return vscode.commands.executeCommand('mavensmate.oAuthProject');
        }     
    }

    private promptToOpenProject(){
        let message = `${this.label} requires an open MavensMate project`;
        let openProject = 'Open Project';
        return vscode.window.showWarningMessage(message, openProject)
            .then((answer) => {
                if(answer == openProject){
                    return vscode.commands.executeCommand('mavensmate.openProject');
                }
            });
    }
}