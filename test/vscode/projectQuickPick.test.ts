import assert = require('assert');
import sinon = require('sinon');

import projectList = require('../../src/workspace/projectList');
import { window, QuickPickItem, commands, Uri } from 'vscode';

import { showProjectQuickPick, projectQuickPickItem, openProject, showProjectListAndOpen } from '../../src/vscode/projectQuickPick';


suite('project Quick Pick', () => {
    suite('show', () => {
        let promisedProjects: projectList.projectDirectory[] = [
            { name: 'project1', workspace: 'workspace1', path: 'path1' },
            { name: 'project2', workspace: 'workspace1', path: 'path2' },
            { name: 'project3', workspace: 'workspace2', path: 'path3' }
        ];
        let expectedQuickPickItems: projectQuickPickItem[] = [
            { label: 'project1', description: 'workspace1', detail: 'path1', path: 'path1' },
            { label: 'project2', description: 'workspace1', detail: 'path2', path: 'path2' },
            { label: 'project3', description: 'workspace2', detail: 'path3', path: 'path3'  }
        ];
        let promiseListStub: sinon.SinonStub;
        let showQuickPickStub: sinon.SinonStub;
        
        setup(() => {
            promiseListStub = sinon.stub(projectList, 'promiseList').returns(Promise.resolve(promisedProjects));
            showQuickPickStub = sinon.stub(window, 'showQuickPick').returns(Promise.resolve());
        });
        
        teardown(() => {
            promiseListStub.restore();
            showQuickPickStub.restore();
        });
        
        test('it shows expectedQuickPickItems', (testDone) => {
            showProjectQuickPick().then(() => {
                sinon.assert.calledOnce(showQuickPickStub);
                sinon.assert.calledWithExactly(showQuickPickStub, expectedQuickPickItems);
                testDone();
            }, console.error);
        });
    });
    
    suite('open', () => {
        let projectItem: projectQuickPickItem = { 
            label: 'project1',
            description: 'workspace1',
            detail: 'path1',
            path: 'path1' 
        };
        let validUri = 'a valid uri';
        let uriParseStub: sinon.SinonStub;
        let executeCommandStub: sinon.SinonStub;
        
        setup(() => {
            uriParseStub = sinon.stub(Uri, 'parse').returns(validUri);
            executeCommandStub = sinon.stub(commands, 'executeCommand').returns(Promise.resolve());
        });
        
        teardown(() => {
            uriParseStub.restore();
            executeCommandStub.restore();
        });
        
        test('it executes openFolder command with projectUri', (testDone) => {
            openProject(projectItem).then(() => {
                sinon.assert.calledOnce(uriParseStub);
                sinon.assert.calledWithExactly(uriParseStub, 'path1');
                sinon.assert.calledOnce(executeCommandStub);
                sinon.assert.calledWithExactly(executeCommandStub, 'vscode.openFolder', validUri);
                testDone();
            }, (error) => {
                assert.fail(null, null, error, null);
                testDone();
            });
        });
    });

    suite('show & open', () => {
        let promisedProjects: projectList.projectDirectory[] = [
            { name: 'project1', workspace: 'workspace1', path: 'path1' },
            { name: 'project2', workspace: 'workspace1', path: 'path2' },
            { name: 'project3', workspace: 'workspace2', path: 'path3' }
        ];
        let expectedQuickPickItems: projectQuickPickItem[] = [
            { label: 'project1', description: 'workspace1', detail: 'path1', path: 'path1' },
            { label: 'project2', description: 'workspace1', detail: 'path2', path: 'path2' },
            { label: 'project3', description: 'workspace2', detail: 'path3', path: 'path3'  }
        ];
        let promiseListStub: sinon.SinonStub;
        let showQuickPickStub: sinon.SinonStub;
        let projectItem: projectQuickPickItem = { 
            label: 'project5',
            description: 'workspace5',
            detail: 'path5',
            path: 'path5' 
        };
        let validUri = 'a valid uri 5';
        let uriParseStub: sinon.SinonStub;
        let executeCommandStub: sinon.SinonStub;
        
        setup(() => {
            promiseListStub = sinon.stub(projectList, 'promiseList').returns(Promise.resolve(promisedProjects));
            showQuickPickStub = sinon.stub(window, 'showQuickPick').returns(Promise.resolve(projectItem));
            uriParseStub = sinon.stub(Uri, 'parse').returns(validUri);
            executeCommandStub = sinon.stub(commands, 'executeCommand').returns(Promise.resolve());
        });
        
        teardown(() => {
            promiseListStub.restore();
            showQuickPickStub.restore();
            uriParseStub.restore();
            executeCommandStub.restore();
        });
        
        test('it executes openFolder command with projectUri', (testDone) => {
            showProjectListAndOpen().then(() => {
                sinon.assert.calledOnce(uriParseStub);
                sinon.assert.calledWithExactly(uriParseStub, 'path5');
                sinon.assert.calledOnce(executeCommandStub);
                sinon.assert.calledWithExactly(executeCommandStub, 'vscode.openFolder', validUri);
                testDone();
            }, (error) => {
                assert.fail(null, null, error, null);
                testDone();
            });
        });
    });
});
