import { ClientCommand } from './clientCommand';
import { BaseCommand } from './baseCommand';
import * as vscode from 'vscode';

class OpenSettings extends ClientCommand {
    static allowWithoutProject: boolean = true;
    static create(): BaseCommand {
        return new OpenSettings();
    }

    constructor() {
        super('Open Settings', 'open-settings');
        this.async = false;
        this.body.args.ui = true;
    }
}

export = OpenSettings;