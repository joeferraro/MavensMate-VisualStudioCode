import { MavensMateChannel } from '../../vscode/mavensMateChannel';

import Promise = require('bluebird');
import * as vscode from 'vscode';

interface BaseCommandInterface {
    currentTextDocument?: boolean,
    confirm?: {
        message: string
    }
}

export abstract class BaseCommand implements BaseCommandInterface {
    label: string;
    mavensMateChannel: MavensMateChannel;

    constructor(label: string) {
        this.label = label;

        this.mavensMateChannel = MavensMateChannel.getInstance();
    }

    abstract execute(selectedResource?: vscode.Uri): Thenable<any>;
}