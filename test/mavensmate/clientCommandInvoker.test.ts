import assert = require('assert');
import sinon = require('sinon');
import vscode = require('vscode');
import Command from '../../src/mavensmate/command';

import { MavensMateClient, Options } from '../../src/mavensmate/mavensMateClient';
import { MavensMateStatus } from '../../src/vscode/mavensMateStatus';
import { MavensMateChannel } from '../../src/vscode/mavensMateChannel';
import { CommandEventRouter } from '../../src/mavensmate/commandEventRouter';

import { ClientCommandInvoker } from '../../src/mavensmate/clientCommandInvoker';

let clientOptions: Options = null;
let client = MavensMateClient.getInstance();
let channel = MavensMateChannel.getInstance();
let status = MavensMateStatus.getInstance();

let testCommand: Command;
let commandInvoker: ClientCommandInvoker;

let testDocument: vscode.TextDocument;
let testEditor: vscode.TextEditor;

let sendCommandStub : sinon.SinonStub;
let onStartStub : sinon.SinonStub;
let onSuccessStub : sinon.SinonStub;
let onErrorStub : sinon.SinonStub;

let commandEventRouter: CommandEventRouter;

suite('commandInvoker', () => {
    setup((setupDone) => {
         testCommand = { command: 'test command', name: 'test command', async: false };
         commandEventRouter = withStubbedCommandEventRouter();
         commandInvoker = ClientCommandInvoker.Create(client, testCommand, commandEventRouter);
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

function withStubbedCommandEventRouter(): CommandEventRouter {
    commandEventRouter = CommandEventRouter.Create(null);
    onStartStub = sinon.stub(commandEventRouter, 'onStart').returns(Promise.resolve());
    onSuccessStub = sinon.stub(commandEventRouter, 'onSuccess').returns(Promise.resolve());
    onErrorStub = sinon.stub(commandEventRouter, 'onError').returns(Promise.resolve());

    return commandEventRouter;
}

function withAFailureResponse(){
    sendCommandStub = sinon.stub(client, 'sendCommand').returns(Promise.reject(null));
}

function withASuccessResponse(){
    sendCommandStub = sinon.stub(client, 'sendCommand').returns(Promise.resolve());
}

function restoreTheStubs(){
    sendCommandStub.restore();
}

function assertStubsCalled(expectedCommand: Command, withError: boolean) {
    sinon.assert.calledOnce(sendCommandStub);
    sinon.assert.calledWithExactly(sendCommandStub, expectedCommand);
    sinon.assert.calledOnce(onStartStub);
    if(withError){
        sinon.assert.calledOnce(onErrorStub);
        sinon.assert.notCalled(onSuccessStub);
    } else {
        sinon.assert.notCalled(onErrorStub);
        sinon.assert.calledOnce(onSuccessStub);
    }
}