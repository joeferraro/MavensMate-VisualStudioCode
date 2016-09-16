import assert = require('assert');
import sinon = require('sinon');

import { MavensMateClient, Options } from '../../src/mavensmate/mavensMateClient';
import ProjectQuickPick = require('../../src/vscode/projectQuickPick');
import { ClientCommandInvoker } from '../../src/mavensmate/clientCommandInvoker';
import { CommandEventRouter } from '../../src/mavensmate/commandEventRouter';
import ClientCommands = require('../../src/mavensmate/clientCommands');
import vscode = require('vscode');
import { TestExtensionContext } from './testExtensionContext';

import { registerCommands } from '../../src/vscode/commandRegistrar';
import { MavensMateChannel } from '../../src/vscode/mavensMateChannel';

let clientOptions: Options = null;
let client = MavensMateClient.getInstance();
let channel = MavensMateChannel.getInstance();
let context : vscode.ExtensionContext = new TestExtensionContext();
let command1 = { command: '1', name: 'command', async: false };
let command2 = { command: '2', name: 'command', async: false };
let command3 = { command: '3', name: 'command', async: false, paths: 'active' };
let commandList = {
    'command1': command1,
    'command2': command2
};
let commandInvoker1 = ClientCommandInvoker.Create(null, command1, null);
let commandInvoker2 = ClientCommandInvoker.Create(null, command2, null);
let commandRegistration1 = new vscode.Disposable(() => {});
let commandRegistration2 = new vscode.Disposable(() => {});
let commandRegistration3 = new vscode.Disposable(() => {});
let commandEventRouter: CommandEventRouter = withStubbedCommandEventRouter();

suite('commandRegistrar', () => {
    let commandListStub : sinon.SinonStub;
    let createInvokerStub : sinon.SinonStub;
    let registerCommandStub : sinon.SinonStub;
    let subscriptionPushStub : sinon.SinonStub;

    setup(() => {
        commandListStub = sinon.stub(ClientCommands, 'list').returns(commandList);
        createInvokerStub = sinon.stub(ClientCommandInvoker, 'Create');
        createInvokerStub.withArgs(client, command1, commandEventRouter).returns(commandInvoker1);
        createInvokerStub.withArgs(client, command2, commandEventRouter).returns(commandInvoker2);
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
        registerCommands(context);

        sinon.assert.calledOnce(commandListStub);
        sinon.assert.calledTwice(createInvokerStub);
        sinon.assert.calledWith(createInvokerStub, client, command1, commandEventRouter);
        sinon.assert.calledWith(createInvokerStub, client, command2, commandEventRouter);
        sinon.assert.callCount(registerCommandStub, 4);
        sinon.assert.calledWith(registerCommandStub, 'command1', commandInvoker1.invokeProxy);
        sinon.assert.calledWith(registerCommandStub, 'command2', commandInvoker2.invokeProxy);
        sinon.assert.calledWith(registerCommandStub, 'mavensmate.openProject', ProjectQuickPick.showProjectListAndOpen);
    });
});

function withStubbedCommandEventRouter(): CommandEventRouter {
    commandEventRouter = CommandEventRouter.Create(null);
    sinon.stub(commandEventRouter, 'onStart').returns(Promise.resolve());
    sinon.stub(commandEventRouter, 'onSuccess').returns(Promise.resolve());
    sinon.stub(commandEventRouter, 'onError').returns(Promise.resolve());

    return commandEventRouter;
}