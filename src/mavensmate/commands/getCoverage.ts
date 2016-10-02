import { PathsCommand } from './pathsCommand';
import { BaseCommand } from './baseCommand';
import { MavensMateChannel } from '../../vscode/mavensMateChannel';
import { MavensMateCodeCoverage } from '../../vscode/mavensMateCodeCoverage';

import * as vscode from 'vscode';
import path = require('path');
import Promise = require('bluebird');

module.exports = class GetCoverage extends PathsCommand {
    mavensMateCodeCoverage: MavensMateCodeCoverage;
    static create(){
        return new GetCoverage();
    }

    constructor() {
        super('Get Apex Code Coverage', 'get-coverage')
        this.mavensMateCodeCoverage = MavensMateCodeCoverage.getInstance();
    }

    protected confirmPath(): Thenable<any> {
        if(this.filePath.indexOf('apex-scripts') === -1){
            return super.confirmPath();
        } else {
            return Promise.reject(`Local Apex Scripts aren't covered by tests`);
        }
    }

    onSuccess(response): Promise<any> {
        return super.onSuccess(response)
            .then(() => this.handleCoverageResponse(response));
    }

    private handleCoverageResponse(response){
        if(response.result && response.result != []) {
            for(let pathEnd in response.result){
                let workspaceRoot = vscode.workspace.rootPath;
                let filePath = path.join(workspaceRoot, 'src', 'classes', pathEnd);

                let coverageResult = response.result[pathEnd];
                let uncoveredLines: number[] = coverageResult.uncoveredLines;

                this.mavensMateCodeCoverage.report(filePath, coverageResult.percentCovered, uncoveredLines);
            }
        } else {
            let message = `No Apex Code Coverage Available: ${this.baseName} (${this.filePath})`;
            this.mavensMateChannel.appendLine(message);
        }
    }
}
