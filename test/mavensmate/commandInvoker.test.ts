import assert = require('assert');
import sinon = require('sinon');
import vscode = require('vscode');
import Command from '../../src/mavensmate/command';

import { MavensMateClient, Options } from '../../src/mavensmate/mavensMateClient';
import { MavensMateStatus } from '../../src/vscode/mavensMateStatus';
import { MavensMateChannel } from '../../src/vscode/mavensMateChannel';
import ClientCommandEventHandler from '../../src/mavensmate/clientCommandEventHandler';

import { CommandInvoker } from '../../src/mavensmate/commandInvoker';

let clientOptions: Options = null;
let client = MavensMateClient.Create(clientOptions);
let channel = MavensMateChannel.Create();
let status = MavensMateStatus.Create(client, channel);

let testCommand: Command;
let commandInvoker: CommandInvoker;

let testDocument: vscode.TextDocument;
let testEditor: vscode.TextEditor;

let sendCommandStub : sinon.SinonStub;
let onStartStub1 : sinon.SinonStub;
let onStartStub2 : sinon.SinonStub;
let onSuccessStub1 : sinon.SinonStub;
let onSuccessStub2 : sinon.SinonStub;
let onErrorStub1 : sinon.SinonStub;
let onErrorStub2 : sinon.SinonStub;

let eventHandler1: ClientCommandEventHandler;
let eventHandler2: ClientCommandEventHandler;

suite('commandInvoker', () => {
    setup((setupDone) => {
         testCommand = { command: 'test command', async: false };
         let eventHandlers = withStubbedEventHandlers();
         commandInvoker = CommandInvoker.Create(client, testCommand, eventHandlers);
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

function withStubbedEventHandlers(): ClientCommandEventHandler[] {
    eventHandler1 = {
        onStart: (command: Command) => {
            console.error('eventHandler1.onStart was not stubbed');
            return null;
        },
        onSuccess: (command: Command, response: any) => {
            console.error('eventHandler1.onSuccess was not stubbed');
            return null;
        },
        onError: (command: Command, response: any) => {
            console.error('eventHandler1.onError was not stubbed');
            return null;
        },
        dispose: () => {}
    }
    onStartStub1 = sinon.stub(eventHandler1, 'onStart').returns(Promise.resolve());
    onSuccessStub1 = sinon.stub(eventHandler1, 'onSuccess').returns(Promise.resolve());
    onErrorStub1 = sinon.stub(eventHandler1, 'onError').returns(Promise.resolve());

    eventHandler2 = {
        onStart: (command: Command) => {
            console.error('eventHandler2.onStart was not stubbed');
            return null;
        },
        onSuccess: (command: Command, response: any) => {
            console.error('eventHandler2.onSuccess was not stubbed');
            return null;
        },
        onError: (command: Command, response: any) => {
            console.error('eventHandler2.onError was not stubbed');
            return null;
        },
        dispose: () => {}
    }
    onStartStub2 = sinon.stub(eventHandler2, 'onStart').returns(Promise.resolve());
    onSuccessStub2 = sinon.stub(eventHandler2, 'onSuccess').returns(Promise.resolve());
    onErrorStub2 = sinon.stub(eventHandler2, 'onError').returns(Promise.resolve());

    return [eventHandler1, eventHandler2];
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
    sinon.assert.calledOnce(onStartStub1);
    sinon.assert.calledOnce(onStartStub2);
    if(withError){
        sinon.assert.calledOnce(onErrorStub1);
        sinon.assert.calledOnce(onErrorStub2);
        sinon.assert.notCalled(onSuccessStub1);
        sinon.assert.notCalled(onSuccessStub2);
    } else {
        sinon.assert.notCalled(onErrorStub1);
        sinon.assert.notCalled(onErrorStub2);
        sinon.assert.calledOnce(onSuccessStub1);
        sinon.assert.calledOnce(onSuccessStub2);
    }
}