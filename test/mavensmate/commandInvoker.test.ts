import assert = require('assert');
import sinon = require('sinon');
import vscode = require('vscode');
import Command from '../../src/mavensmate/command';

import { MavensMateClient, Options } from '../../src/mavensmate/mavensMateClient';
import { MavensMateStatus } from '../../src/vscode/mavensMateStatus';

import { CommandInvoker } from '../../src/mavensmate/commandInvoker';

let clientOptions: Options = null;
let client = MavensMateClient.Create(clientOptions);
let status = MavensMateStatus.Create(client);

let testCommand: Command;
let commandInvoker: CommandInvoker;

let testDocument: vscode.TextDocument;
let testEditor: vscode.TextEditor;

let commandStartedStub : sinon.SinonStub;
let sendCommandStub : sinon.SinonStub;
let commandStoppedStub : sinon.SinonStub;

suite('commandInvoker', () => {
    setup(() => {
         testCommand = { command: 'test command', async: false };
         commandInvoker = CommandInvoker.Create(client, status, testCommand);
    });
    
    suite('invoke', () => {
        suite('invokes with Error',() => {
            setup(withAFailureResponse);

            teardown(restoreTheStubs);

            test('calls stubs', (testDone) => {
                
                commandInvoker.invoke().then(() => {
                    assertStubsCalled(testCommand);
                    sinon.assert.calledWithExactly(commandStoppedStub, true);
                    testDone();
                }).catch((error) => {
                    console.log(error);
                });

            });

            test('proxy calls stubs', (testDone) => {
                commandInvoker.invokeProxy().then(() => {
                    assertStubsCalled(testCommand);
                    sinon.assert.calledWithExactly(commandStoppedStub, true);
                    testDone();
                });
            });
        });
        
        suite('invokes with no Error',() => {
            setup(withASuccessResponse);

            teardown(restoreTheStubs);

            test('calls stubs', (testDone) => {
                commandInvoker.invoke().then(() => {
                    assertStubsCalled(testCommand);
                    sinon.assert.calledWithExactly(commandStoppedStub, false);
                    testDone();
                });
            });

            test('proxy calls stubs', (testDone) => {
                commandInvoker.invokeProxy().then(() => {
                    assertStubsCalled(testCommand);
                    sinon.assert.calledWithExactly(commandStoppedStub, false);
                    testDone();
                });
            });
        });
    });

    suite('invokeTextEditor', () => {
        setup(withAValidTestDocument);
        suite('invokes with Error',() => {
            setup(withAFailureResponse);

            teardown(restoreTheStubs);

            test('calls stubs', (testDone) => {
                console.log(testEditor);
                commandInvoker.invokeTextEditor(testEditor, null).then(() => {
                    assertStubsCalled(testCommand);
                    sinon.assert.calledWithExactly(commandStoppedStub, true);
                    testDone();
                });

            });

            test('proxy calls stubs', (testDone) => {
                commandInvoker.invokeTextEditorProxy(testEditor, null).then(() => {
                    assertStubsCalled(testCommand);
                    sinon.assert.calledWithExactly(commandStoppedStub, true);
                    testDone();
                });
            });
        });
        
        suite('invokes with no Error',() => {
            setup(withASuccessResponse);

            teardown(restoreTheStubs);

            test('calls stubs', (testDone) => {
                commandInvoker.invokeTextEditor(testEditor, null).then(() => {
                    assertStubsCalled(testCommand);
                    sinon.assert.calledWithExactly(commandStoppedStub, false);
                    testDone();
                });
            });

            test('proxy calls stubs', (testDone) => {
                commandInvoker.invokeTextEditorProxy(testEditor, null).then(() => {
                    assertStubsCalled(testCommand);
                    sinon.assert.calledWithExactly(commandStoppedStub, false);
                    testDone();
                });
            });
        });
    });
});

function withAValidTestDocument(done){
    return vscode.workspace.openTextDocument(vscode.workspace.rootPath + '/testApexClass.cls')
        .then((openedDocument: vscode.TextDocument) => {
            
            testDocument = openedDocument;
            
            testCommand.body = {
                paths: [testDocument.uri.fsPath]
            };
            return vscode.window.showTextDocument(testDocument).then((documentEditor) => {
                testEditor = documentEditor;
            });
        })
        .then(done);
}

function withAFailureResponse(){
    commandStartedStub = sinon.stub(status, 'commandStarted');
    sendCommandStub = sinon.stub(client, 'sendCommand').returns(Promise.reject(null));
    commandStoppedStub = sinon.stub(status, 'commandStopped');
}

function withASuccessResponse(){
    commandStartedStub = sinon.stub(status, 'commandStarted');
    sendCommandStub = sinon.stub(client, 'sendCommand').returns(Promise.resolve());
    commandStoppedStub = sinon.stub(status, 'commandStopped');
}

function restoreTheStubs(){
    commandStartedStub.restore();
    sendCommandStub.restore();
    commandStoppedStub.restore();
}

function assertStubsCalled(expectedCommand: Command) {
    sinon.assert.calledOnce(commandStartedStub);
    sinon.assert.calledOnce(sendCommandStub);
    sinon.assert.calledWithExactly(sendCommandStub, expectedCommand);
    sinon.assert.calledOnce(commandStoppedStub);
}