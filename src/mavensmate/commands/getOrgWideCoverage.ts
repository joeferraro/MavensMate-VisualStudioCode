import { ClientCommand } from './clientCommand';
import { BaseCommand } from './baseCommand';
import { MavensMateChannel } from '../../vscode/mavensMateChannel';
import { MavensMateCodeCoverage } from '../../vscode/mavensMateCodeCoverage';

import * as vscode from 'vscode';
import path = require('path');
import Promise = require('bluebird');

class GetOrgWideCoverage extends ClientCommand {
    mavensMateCodeCoverage: MavensMateCodeCoverage;
    static create(){
        return new GetOrgWideCoverage();
    }

    constructor() {
        super('Get Org Wide Apex Code Coverage', 'get-coverage')
        this.mavensMateCodeCoverage = MavensMateCodeCoverage.getInstance();
        this.body.global = true;
    }

    onSuccess(response): Promise<any> {
        return super.onSuccess(response)
            .then(() => this.handleCoverageResponse(response));
    }

    private handleCoverageResponse(response){
        if(response.result && typeof response.result == 'number') {
            let orgWideCoverage = `Org Wide Test Coverage: ${response.result}%`;
            vscode.window.showInformationMessage(orgWideCoverage);
        } else {
            let message = `No Apex Code Coverage Available Org Wide`;
            this.mavensMateChannel.appendLine(message);
            vscode.window.showWarningMessage(message);
        }
    }
}

export = GetOrgWideCoverage;
