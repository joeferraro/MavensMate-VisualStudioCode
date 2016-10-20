import { ClientCommand } from './clientCommand';
import { handleCompileResponse } from '../handlers/compileResponseHandler';

import * as vscode from 'vscode';
import path = require('path');

class CompileProject extends ClientCommand {
    static create(): CompileProject{
        return new CompileProject();
    }

    constructor() {
        super('Compile Project', 'compile-project');
        this.async = true;
        this.body.args.ui = false;
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

export = CompileProject;