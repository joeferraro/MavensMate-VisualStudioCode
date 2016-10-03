import { ClientCommand } from './clientCommand';
import { BaseCommand } from './baseCommand';
import * as vscode from 'vscode';

class RunTests extends ClientCommand {
    static create(): BaseCommand {
        return new RunTests();
    }

    constructor() {
        super('Run Apex Tests', 'run-tests');
        this.async = false;
        this.body.args.ui = true;
    }
}

export = RunTests;