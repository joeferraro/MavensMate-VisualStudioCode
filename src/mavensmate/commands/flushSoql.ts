import { ClientCommand } from './clientCommand';

import * as vscode from 'vscode';
import path = require('path');
import Promise = require('bluebird');


module.exports = class FlushSoql extends ClientCommand {
   
    static create(){
        return new FlushSoql();
    }

    constructor() {
        super('Flush SOQL', 'flush-soql');
        this.async = true;
        this.body.args.ui = false;
    }

    execute(selectedResource?: vscode.Uri): Thenable<any> {
        return super.execute();
    }
}