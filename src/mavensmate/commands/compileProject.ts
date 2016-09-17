import { ClientCommand } from './clientCommand';
import { ClientCommandInterface } from './clientCommandInterface';
import { BaseCommand } from './baseCommand';
import { MavensMateChannel } from '../../vscode/mavensMateChannel';
import { handleCompileResponse } from '../handlers/compileResponseHandler';

import * as vscode from 'vscode';
import path = require('path');

let mavensMateChannel: MavensMateChannel = MavensMateChannel.getInstance();

module.exports = class CompileProject extends ClientCommand implements ClientCommandInterface {
    body: {
        args: {
            ui: boolean
        }
    }

    static create(){
        return new CompileProject();
    }

    constructor() {
        super('Compile Project');
        this.id = 'compile-project';
        this.async = true;
        
        this.body = {
            args: {
                ui: false
            }
        };
    }

    execute(selectedResource?: vscode.Uri): Thenable<any> {
        let confirmMessage = 'Would you like to compile the project?';
        return vscode.window.showInformationMessage(confirmMessage, 'Yes').then((answer) => {
            if(answer === 'Yes'){
                return super.execute().then(handleCompileResponse);
            } else {
                return;
            }
        }); 
    }
}