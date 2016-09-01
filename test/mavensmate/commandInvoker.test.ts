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
    setup((setupDone) => {
         testCommand = { command: 'test command', async: false };
         commandInvoker = CommandInvoker.Create(client, status, testCommand);
         withAValidTestDocument(setupDone);
    });
    
    suite('invoke', () => {

        suite('with Error',() => {
            let expectedWithError = true;
            setup(withAFailureResponse);

            teardown(restoreTheStubs);

            test('with Uri calls stubs', (testDone) => {
                commandInvoker.invoke(testDocument.uri).then(() => { 
                    assertStubsCalled(testCommand, expectedWithError);
                }).then(testDone);

            });

            test('with Uri proxy calls stubs', (testDone) => {
                commandInvoker.invokeProxy(testDocument.uri).then(() => {
                    assertStubsCalled(testCommand, expectedWithError);
                }).then(testDone);
            });

            test('without Uri calls stubs', (testDone) => {
                commandInvoker.invoke().then(() => { 
                    assertStubsCalled(testCommand, expectedWithError);
                }).then(testDone);
            });

            test('without Uri proxy calls stubs', (testDone) => {
                commandInvoker.invokeProxy().then(() => {
                    assertStubsCalled(testCommand, expectedWithError);
                }).then(testDone);
            });
        }); 
            
        suite('invokes with no Error',() => {
            let expectedWithError = false;
            setup(withASuccessResponse);

            teardown(restoreTheStubs);

            test('with Uri calls stubs', (testDone) => {
                commandInvoker.invoke(testDocument.uri).then(() => { 
                    assertStubsCalled(testCommand, expectedWithError);
                }).then(testDone);
            });

            test('with Uri proxy calls stubs', (testDone) => {
                commandInvoker.invokeProxy(testDocument.uri).then(() => {
                    assertStubsCalled(testCommand, expectedWithError);
                }).then(testDone);
            });

            test('without Uri calls stubs', (testDone) => {
                commandInvoker.invoke().then(() => { 
                    assertStubsCalled(testCommand, expectedWithError);
                }).then(testDone);
            });

            test('without Uri proxy calls stubs', (testDone) => {
                commandInvoker.invokeProxy().then(() => {
                    assertStubsCalled(testCommand, expectedWithError);
                }).then(testDone);
            });
        });
    });

    suite('invokeTextEditor', () => {
        let invokeStub: sinon.SinonStub;

        setup(() => {
            invokeStub = sinon.stub(commandInvoker, 'invoke').returns(Promise.resolve());
        });

        teardown(() => {
            invokeStub.restore();
        });

        test('calls invoke', (testDone) => {
            commandInvoker.invokeTextEditor(testEditor, null).then(() => { 
                invokeStub.calledWithExactly(testEditor.document.uri);
            }).then(testDone);
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

function assertStubsCalled(expectedCommand: Command, withError: boolean) {
    sinon.assert.calledOnce(commandStartedStub);
    sinon.assert.calledOnce(sendCommandStub);
    sinon.assert.calledWithExactly(sendCommandStub, expectedCommand);
    sinon.assert.calledOnce(commandStoppedStub);
    sinon.assert.calledWithExactly(commandStoppedStub, withError);
}