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

    constructor(label: string) {
        this.label = label;
    }

    abstract execute(selectedResource?: vscode.Uri): Thenable<any>;
}