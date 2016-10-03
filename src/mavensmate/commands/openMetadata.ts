import { PathsCommand } from './pathsCommand';

import * as vscode from 'vscode';
let languagesToCompileOnSave = new Set<string>(['apex', 'visualforce', 'xml', 'javascript']);

module.exports = class OpenMetadata extends PathsCommand {
    static create(){
        return new OpenMetadata();
    }

    constructor() {
        super('Open Metadata', 'open-metadata');
        this.async = false;
        this.body.callThrough = true;
        this.body.args.ui = false;
    }
}