import assert = require('assert');
import sinon = require('sinon');

import { MavensMateClient, Options } from '../../src/mavensmate/mavensMateClient';
import { MavensMateStatus } from '../../src/vscode/mavensMateStatus';

import { CommandInvoker } from '../../src/mavensmate/commandInvoker';

let clientOptions: Options = null;
let client = MavensMateClient.Create(clientOptions);
let status = MavensMateStatus.Create(client);
let testCommand = { test: 'testing command' };

suite('commandInvoker', () => {
    let commandStartedStub : sinon.SinonStub;
    let sendCommandStub : sinon.SinonStub;
    let commandStoppedStub : sinon.SinonStub;

    let commandInvoker = CommandInvoker.Create(client, status, testCommand);
    
    let assertStubsCalled = () => {
        sinon.assert.calledOnce(commandStartedStub);
        sinon.assert.calledOnce(sendCommandStub);
        sinon.assert.calledWithExactly(sendCommandStub, testCommand);
        sinon.assert.calledOnce(commandStoppedStub);
    }

    suite('invokes with Error',() => {
        setup(() => {
            commandStartedStub = sinon.stub(status, 'commandStarted');
            sendCommandStub = sinon.stub(client, 'sendCommand').returns(Promise.reject(null));
            commandStoppedStub = sinon.stub(status, 'commandStopped');
        });

        teardown(() => {
            commandStartedStub.restore();
            sendCommandStub.restore();
            commandStoppedStub.restore();
        });

        test('calls stubs', (testDone) => {
            commandInvoker.invoke().then(() => {
                assertStubsCalled();
                sinon.assert.calledWithExactly(commandStoppedStub, true);
                testDone();
            });

        });

        test('proxy calls stubs', (testDone) => {
            commandInvoker.invokeProxy().then(() => {
                assertStubsCalled();
                sinon.assert.calledWithExactly(commandStoppedStub, true);
                testDone();
            });
        });
    });
    
    suite('invokes with no Error',() => {
        setup(() => {
            commandStartedStub = sinon.stub(status, 'commandStarted');
            sendCommandStub = sinon.stub(client, 'sendCommand').returns(Promise.resolve());
            commandStoppedStub = sinon.stub(status, 'commandStopped');
        });

        teardown(() => {
            commandStartedStub.restore();
            sendCommandStub.restore();
            commandStoppedStub.restore();
        });

        test('calls stubs', (testDone) => {
            commandInvoker.invoke().then(() => {
                assertStubsCalled();
                sinon.assert.calledWithExactly(commandStoppedStub, false);
                testDone();
            });
        });

        test('proxy calls stubs', (testDone) => {
            commandInvoker.invokeProxy().then(() => {
                assertStubsCalled();
                sinon.assert.calledWithExactly(commandStoppedStub, false);
                testDone();
            });
        });
    });
});