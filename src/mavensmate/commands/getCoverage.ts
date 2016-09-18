import { ClientCommand } from './clientCommand';
import { ClientCommandInterface } from './clientCommandInterface';
import { BaseCommand } from './baseCommand';
import { MavensMateChannel } from '../../vscode/mavensMateChannel';
import { MavensMateCodeCoverage } from '../../vscode/mavensMateCodeCoverage';

import * as vscode from 'vscode';
import path = require('path');
import Promise = require('bluebird');

let mavensMateChannel: MavensMateChannel = MavensMateChannel.getInstance();
let mavensMateCodeCoverage: MavensMateCodeCoverage = MavensMateCodeCoverage.getInstance();

module.exports = class GetCoverage extends ClientCommand implements ClientCommandInterface {
    body: {
        paths: string[],
        args: {
            ui: boolean
        }
    }
    filePath: string;

    static create(){
        return new GetCoverage();
    }

    constructor() {
        super('Get Apex Code Coverage');
        this.id = 'get-coverage';
        this.async = true;
        
        this.body = {
            paths: [],
            args: {
                ui: false
            }
        };
    }

    execute(selectedResource?: vscode.Uri): Thenable<any> {
        let executePromise = null;
        if(selectedResource && selectedResource.scheme === 'file'){
            this.filePath = selectedResource.fsPath
            this.body.paths.push(this.filePath);
            executePromise = super.execute();
        } else if(vscode.window.activeTextEditor.document) {
            this.filePath = vscode.window.activeTextEditor.document.uri.fsPath
            this.body.paths.push(this.filePath);
            executePromise = super.execute();
        } else {
            console.warn('No file selected to retrieve coverage for');
        }
        return executePromise;
    }

    onStart(): Promise<any>{
        return super.onStart()
            .then(() => {
                let compileMessage = 'Retrieving Apex Code Coverage: ' + path.basename(this.filePath);
                mavensMateChannel.appendLine(compileMessage);
            });
    }

    onFinish(response): Promise<any> {
        return super.onFinish(response)
            .then((response) => {
                let message = 'Retrieved Apex Code Coverage: ' + path.basename(this.filePath) + ` (${this.filePath})`;
                return mavensMateChannel.appendLine(message)
                    .then(() => this.handleCoverageResponse(response));
            }, (response) => {
                let message = 'Failed to Retrieve Apex Code Coverage: ' + path.basename(this.filePath) + ` (${this.filePath})`;
                mavensMateChannel.appendLine(message);
            });
    }

    private handleCoverageResponse(response){
        if(response.result && response.result != []) {
            for(let pathEnd in response.result){
                let workspaceRoot = vscode.workspace.rootPath;
                let filePath = path.join(workspaceRoot, 'src', 'classes', pathEnd);

                let coverageResult = response.result[pathEnd];
                let uncoveredLines: number[] = coverageResult.uncoveredLines;

                mavensMateCodeCoverage.report(filePath, coverageResult.percentCovered, uncoveredLines);
            }
        } else {
            let message = 'No Apex Code Coverage Available: ' + path.basename(this.filePath) + ` (${this.filePath})`;
            mavensMateChannel.appendLine(message);
        }
    }

    executeTextEditor(textEditor: vscode.TextEditor, edit: vscode.TextEditorEdit): Thenable<any> {
        let selectedResource: vscode.Uri = textEditor.document.uri;
        return this.execute(selectedResource);
    }
}
