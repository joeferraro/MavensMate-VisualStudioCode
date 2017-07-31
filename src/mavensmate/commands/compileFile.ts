import { PathsCommand } from './pathsCommand';
import { MavensMateChannel } from '../../vscode/mavensMateChannel';
import { handleCompileResponse } from '../handlers/compileResponseHandler';

import * as vscode from 'vscode';
import Promise = require('bluebird');

let languagesToCompileOnSave = new Set<string>(['apex', 'visualforce', 'xml', 'javascript', 'css']);

class CompileFile extends PathsCommand {
    static create(label?: string): PathsCommand{
        if(!label){
            label = 'Compile File';
        }
        return new CompileFile(label);
    }

    constructor(label: string) {
        super(label, 'compile-metadata');
    }

    protected confirmPath(): Thenable<any> {
        let uriToOpen = vscode.Uri.file(this.filePath);
        let confirmPromise = vscode.workspace.openTextDocument(uriToOpen)
            .then((textDocument) => {
                if(!languagesToCompileOnSave.has(textDocument.languageId)){
                    return Promise.reject(`Can not compile this file: ${this.filePath}`);
                } else if(this.filePath.includes('apex-scripts')){
                    return Promise.reject(`Local Apex Scripts can't be compiled. You can run them with Run Apex Script`);
                }else if(this.filePath.includes('resource-bundles')){
                    return Promise.reject(`Files inside Resource Bundles cannot be compiled. Use Deploy Resource Bundle instead`);
                } else {
                    return super.confirmPath();
                }
            });
        return confirmPromise;
    }

    onSuccess(response): Promise<any> {
        return handleCompileResponse(response)
            .then(() => super.onSuccess(response));
    }
}
export = CompileFile;