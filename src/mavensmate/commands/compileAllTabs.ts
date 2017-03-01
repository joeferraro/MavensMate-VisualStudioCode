import { ClientCommand } from './clientCommand';
import { MavensMateChannel } from '../../vscode/mavensMateChannel';
import { handleCompileResponse } from '../handlers/compileResponseHandler';

import * as vscode from 'vscode';

import BlueBirdPromise = require('bluebird');

let languagesToCompileOnSave = new Set<string>(['apex', 'visualforce', 'xml', 'javascript']);

class CompileAllTabs extends ClientCommand {
    static create(): ClientCommand{
        return new CompileAllTabs();
    }

    constructor() {
        super('Compile All Tabs', 'compile-metadata');
        this.async = true;
        this.body.args.ui = false;
    }

    execute(selectedResource?: vscode.Uri): Thenable<any> {
        return this.getOpenEditors().then((editors) => {
            let filesToSave: string[] = [];
            for(let i=0; i < editors.length; i++){
                let editor = editors[i];
                if (this.validPath(editor)){
                    filesToSave.push(editor.document.fileName);
                }
            }
            this.body.paths = filesToSave;
            return super.execute();
        });
    }

    onStart(): BlueBirdPromise<any> {
        return super.onStart()
            .then(() => {
                for(let i=0; i < this.body.paths.length; i++){
                    this.mavensMateChannel.appendLine(this.body.paths[i]);
                }
            });
    }

    onSuccess(response): BlueBirdPromise<any> {
        return super.onSuccess(response)
            .then(() => handleCompileResponse(response));
    }

    // Hack to get all open tabs.  Taken from:
    //  https://github.com/eamodio/vscode-restore-editors/blob/master/src/documentManager.ts#L43
    async getOpenEditors() {
        try {
            const active = vscode.window.activeTextEditor;

            const editorTracker = new ActiveEditorTracker();

            let editor = active;
            const openEditors: vscode.TextEditor[] = [];
            do {
                openEditors.push(editor);

                vscode.commands.executeCommand('workbench.action.nextEditor');
                editor = await editorTracker.wait();
                console.log(editor);
            } while (active.document.fileName != editor.document.fileName);
            editorTracker.dispose();

            return openEditors;
        }
        catch (ex) {
        }
    }

    private validPath(editor: vscode.TextEditor){
        if (!languagesToCompileOnSave.has(editor.document.languageId)) {
            return false;
        } else if (editor.document.fileName.includes('apex-scripts')) {
            return false;
        } else if (editor.document.fileName.includes('resource-bundles')) {
            return false;
        } else {
            return true;
        }
    }
}

class ActiveEditorTracker extends vscode.Disposable {

    private _disposable: vscode.Disposable;
    private _resolver: (value?: vscode.TextEditor | PromiseLike<vscode.TextEditor>) => void;

    constructor() {
        super(() => this.dispose());

        this._disposable = vscode.window.onDidChangeActiveTextEditor(
            e => this._resolver(e)
        );
    }

    dispose() {
        this._disposable && this._disposable.dispose();
    }

    wait(): Promise<vscode.TextEditor> {
        return new Promise<vscode.TextEditor>(
            (resolve, reject) => this._resolver = resolve
        );
    }
}

export = CompileAllTabs;