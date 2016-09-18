import { ClientCommand } from './clientCommand';
import { ClientCommandInterface } from './clientCommandInterface';
import { BaseCommand } from './baseCommand';
import { MavensMateChannel } from '../../vscode/mavensMateChannel';
import { handleCompileResponse } from '../handlers/compileResponseHandler';

import * as vscode from 'vscode';
import path = require('path');
import Promise = require('bluebird');

let mavensMateChannel: MavensMateChannel = MavensMateChannel.getInstance();

module.exports = class FlushSoql extends ClientCommand implements ClientCommandInterface {
   
    static create(){
        return new FlushSoql();
    }

    constructor() {
        super('Flush SOQL');
        this.id = 'flush-soql';
        this.async = true;
    }

    execute(selectedResource?: vscode.Uri): Thenable<any> {
        return super.execute();
    }

    onStart(): Promise<any> {
        return super.onStart()
            .then(() => {
                let flushSoqlMessage = 'Flushing SOQL'
                mavensMateChannel.appendLine(flushSoqlMessage);
            });
    }

    onFinish(response): Promise<any> {
        return super.onFinish(response)
            .then((response) => {
                let flushSoqlMessage = 'Flushed SOQL';
                mavensMateChannel.appendLine(flushSoqlMessage);
            }, (response) => {
                let flushSoqlMessage = 'Failed to flush SOQL';
                mavensMateChannel.appendLine(flushSoqlMessage);
            });
    }
}