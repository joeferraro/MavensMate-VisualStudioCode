import assert = require('assert');
import sinon = require('sinon');

import { MavensMateClient, Options } from '../../src/mavensmate/mavensMateClient';
import ProjectQuickPick = require('../../src/vscode/projectQuickPick');
import { CommandInvoker } from '../../src/mavensmate/commandInvoker';
import ClientCommandEventHandler from '../../src/mavensmate/ClientCommandEventHandler';
import ClientCommands = require('../../src/mavensmate/clientCommands');
import vscode = require('vscode');
import { TestExtensionContext } from './testExtensionContext';

import { CommandRegistrar } from '../../src/vscode/commandRegistrar';
import { MavensMateChannel } from '../../src/vscode/mavensMateChannel';

let clientOptions: Options = null;
let client = MavensMateClient.Create(clientOptions);
let channel = MavensMateChannel.Create();
let context : vscode.ExtensionContext = new TestExtensionContext();
let command1 = { command: '1', async: false };
let command2 = { command: '2', async: false };
let command3 = { command: '3', async: false, paths: 'active' };
let commandList = {
    'command1': command1,
    'command2': command2
};
let commandInvoker1 = CommandInvoker.Create(null, command1, null);
let commandInvoker2 = CommandInvoker.Create(null, command2, null);
let commandRegistration1 = new vscode.Disposable(() => {});
let commandRegistration2 = new vscode.Disposable(() => {});
let commandRegistration3 = new vscode.Disposable(() => {});
let eventHandlers = withEventHandlers();

let commandRegistrar : CommandRegistrar = CommandRegistrar.Create(client, context, eventHandlers, channel);

suite('commandRegistrar', () => {
    let commandListStub : sinon.SinonStub;
    let createInvokerStub : sinon.SinonStub;
    let registerCommandStub : sinon.SinonStub;
    let subscriptionPushStub : sinon.SinonStub;

    setup(() => {
        commandListStub = sinon.stub(ClientCommands, 'list').returns(commandList);
        createInvokerStub = sinon.stub(CommandInvoker, 'Create');
        createInvokerStub.withArgs(client, command1, eventHandlers).returns(commandInvoker1);
        createInvokerStub.withArgs(client, command2, eventHandlers).returns(commandInvoker2);
        registerCommandStub = sinon.stub(vscode.commands, 'registerCommand');
        registerCommandStub.onFirstCall().returns(commandRegistration1);
        registerCommandStub.onSecondCall().returns(commandRegistration2);
        registerCommandStub.onThirdCall().returns(commandRegistration3);
    });

    teardown(() => {
        commandListStub.restore();
        createInvokerStub.restore();
        registerCommandStub.restore();
    });

    test('registerCommands', () => {
        commandRegistrar.registerCommands();

        sinon.assert.calledOnce(commandListStub);
        sinon.assert.calledTwice(createInvokerStub);
        sinon.assert.calledWith(createInvokerStub ,client, command1, eventHandlers);
        sinon.assert.calledWith(createInvokerStub ,client, command2, eventHandlers);
        sinon.assert.calledThrice(registerCommandStub);
        sinon.assert.calledWith(registerCommandStub, 'command1', commandInvoker1.invokeProxy);
        sinon.assert.calledWith(registerCommandStub, 'command2', commandInvoker2.invokeProxy);
        sinon.assert.calledWith(registerCommandStub, 'mavensmate.openProject', ProjectQuickPick.showProjectListAndOpen);
    });
});

function withEventHandlers(): ClientCommandEventHandler[] {
    let eventHandler1 = {
        onStart: (command) => {
            console.error('eventHandler1.onStart was not stubbed');
            return null;
        },
        onSuccess: (command, response: any) => {
            console.error('eventHandler1.onSuccess was not stubbed');
            return null;
        },
        onError: (command, response: any) => {
            console.error('eventHandler1.onError was not stubbed');
            return null;
        },
        dispose: () => {}
    }

    let eventHandler2 = {
        onStart: (command) => {
            console.error('eventHandler2.onStart was not stubbed');
            return null;
        },
        onSuccess: (command, response: any) => {
            console.error('eventHandler2.onSuccess was not stubbed');
            return null;
        },
        onError: (command, response: any) => {
            console.error('eventHandler2.onError was not stubbed');
            return null;
        },
        dispose: () => {}
    }

    return [eventHandler1, eventHandler2];
}