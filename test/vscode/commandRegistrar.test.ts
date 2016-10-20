import expect = require('expect.js');
import sinon = require('sinon');
import Promise = require('bluebird');

import vscode = require('vscode');
import { registerCommands } from '../../src/vscode/commandRegistrar';

import commandIndex = require('../../src/mavensmate/commands/index');
import CleanProject = require('../../src/mavensmate/commands/cleanProject');
import CompileFile = require('../../src/mavensmate/commands/compileFile');
import CompileProject = require('../../src/mavensmate/commands/compileProject');

let directoryOfCommands = {
    'clean-project': CleanProject,
    'compile-file': CompileFile,
    'compile-project': CompileProject
}

suite('commandRegistrar', () => {
    let commandDirectoryStub: sinon.SinonStub;
    let registerCommandStub: sinon.SinonStub;

    let createSpys: sinon.SinonSpy[];
    let invokeStubs: sinon.SinonStub[];

    setup(() => {
        commandDirectoryStub = sinon.stub(commandIndex, 'commandDirectory').returns(directoryOfCommands);
        registerCommandStub = sinon.stub(vscode.commands, 'registerCommand');

        createSpys = [];
        invokeStubs = [];
        
        createSpys.push(sinon.spy(CleanProject, 'create'));
        createSpys.push(sinon.spy(CompileFile, 'create'));
        createSpys.push(sinon.spy(CompileProject, 'create'));
        
        invokeStubs.push(sinon.stub(CleanProject.prototype, 'invoke'));
        invokeStubs.push(sinon.stub(CompileFile.prototype, 'invoke'));
        invokeStubs.push(sinon.stub(CompileProject.prototype, 'invoke'));
    });

    teardown(() => {
        
        commandDirectoryStub.restore();
        registerCommandStub.restore();
        createSpys.forEach((stub) => {
            stub.restore();
        });
        invokeStubs.forEach((stub) => {
            stub.restore();
        });
    });

    test('registerCommands', (testDone) => {
        registerCommands();

        sinon.assert.calledThrice(registerCommandStub);
        expect(registerCommandStub.getCall(0).args[0]).to.equal('clean-project');
        expect(registerCommandStub.getCall(1).args[0]).to.equal('compile-file');
        expect(registerCommandStub.getCall(2).args[0]).to.equal('compile-project');

        let testPath = 'atestpath';

        let registeredPromises: Promise<any>[] = [
            registerCommandStub.getCall(0).args[1](testPath),
            registerCommandStub.getCall(1).args[1](testPath),
            registerCommandStub.getCall(2).args[1](testPath)
        ];

        Promise.all(registeredPromises).then(() => {
            createSpys.forEach((stub) => {
                sinon.assert.calledOnce(stub);
            });
            invokeStubs.forEach((stub) => {
                sinon.assert.calledWith(stub, testPath);
            });
        }).then(testDone);
    });
});
