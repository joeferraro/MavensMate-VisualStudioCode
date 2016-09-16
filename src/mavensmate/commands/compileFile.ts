import { ClientCommand } from './clientCommand';
import { ClientCommandInterface } from './clientCommandInterface';
import { BaseCommand } from './baseCommand';
import { MavensMateChannel } from '../../vscode/mavensMateChannel';
import { handleCompileResponse } from '../handlers/compileResponseHandler';

import * as vscode from 'vscode';
import path = require('path');

let mavensMateChannel: MavensMateChannel = MavensMateChannel.getInstance();

class CompileFileCommand extends ClientCommand implements ClientCommandInterface {
    body: {
        paths?: string[],
        args?: {
            ui: boolean,
            origin?: string
        }
    }

    constructor() {
        super('Compile File');
        this.id = 'compile-metadata';
        this.async = true;
        
        this.body = {
            args: {
                ui: false
            }
        };
    }

    execute(selectedResource?: vscode.Uri): Thenable<any> {
        if(selectedResource && selectedResource.scheme === 'file'){
            let compilePath = selectedResource.fsPath
            this.body.paths = [compilePath];
            mavensMateChannel.appendLine('Compiling: ' + path.basename(compilePath));
        }
        return super.execute().then(handleCompileResponse);
    }
}

exports.build = (): BaseCommand => {
    let command = new CompileFileCommand();
    return command;
}