import { ClientCommand, SalesforceTest} from './clientCommand';
import * as vscode from 'vscode';
import Promise = require('bluebird');
import path = require('path');

class runTestsMethods extends ClientCommand {
    filePath: string;
    baseName: string;
    static create() {
        return new runTestsMethods();
    }

    constructor() {
        super('Run Apex Test Methods', 'run-test-method');
        this.async = false;
        this.body.args.ui = false;
    }

    execute(selectedResource?: vscode.Uri): Thenable<any> {
        if (selectedResource && selectedResource.scheme === 'file') {
            this.filePath = selectedResource.fsPath;
        } else if (vscode.window.activeTextEditor && vscode.window.activeTextEditor.document) {
            this.filePath = vscode.window.activeTextEditor.document.uri.fsPath;
        }
        return this.confirmPath()
            .then(() => this.getUserInput())
            .then((input: string) => {
                let methodNames = input.replace(' ','')
                    .split(',')
                    .filter(test => test != '');
                this.body.tests = [
                    {
                        testNameOrPath : this.baseName + '.cls',
                        methodNames: methodNames
                    }
                ];
                this.body.skipCoverage = true;
                return super.execute();
            });
    }
    protected getUserInput(): Thenable<any> {
        return vscode.window.showInputBox();
    }

    protected confirmPath(): Thenable<any> {
        if (this.filePath && this.filePath.length > 0) {
            this.baseName = path.basename(this.filePath, '.cls');
        }
        return Promise.resolve();
    }

    onStart(): Promise<any> {
        return super.onStart()
            .then(() => {
                return this.outputPathProcessed();
            });
    }

    private outputPathProcessed() {
        if (this.baseName && this.filePath) {
            let message = `${this.baseName} (${this.filePath})`
            return this.mavensMateChannel.appendLine(message);
        } else {
            return Promise.resolve();
        }
    }

    onSuccess(response): Promise<any> {
        return super.onSuccess(response)
            .then(() => {
                this.outputPathProcessed();
                let classResults = response.testResults[this.baseName];
                this.mavensMateChannel.appendLine(classResults.ExtendedStatus, classResults.Status);
                for (let i = 0; i < classResults.results.length; i++) {
                    let testResult = classResults.results[i];
                    this.mavensMateChannel.appendLine(testResult.MethodName, testResult.Outcome);
                    if (testResult.Outcome == 'Fail') {
                        this.mavensMateChannel.appendLine(testResult.Message);
                        this.mavensMateChannel.appendLine(testResult.StackTrace);
                    }
                }
                return response;
            });
    }

    onFailure(response): Promise<any> {
        return super.onFailure(response)
            .then(() => {
                this.outputPathProcessed().then(response);
                return response;
            });
    }
}

export = runTestsMethods;