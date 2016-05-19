import assert = require('assert');
import sinon = require('sinon');

import projectList = require('../../src/workspace/projectList');
import { window, QuickPickItem } from 'vscode';

import { showProjectQuickPick } from '../../src/vscode/projectQuickPick';

let promisedProjects: projectList.projectDirectory[] = [
    { name: 'project1', workspace: 'workspace1', path: 'path1' },
    { name: 'project2', workspace: 'workspace1', path: 'path2' },
    { name: 'project3', workspace: 'workspace2', path: 'path3' }
];
let expectedQuickPickItems: QuickPickItem[] = [
    { label: 'project1', description: 'workspace1', detail: 'path1' },
    { label: 'project2', description: 'workspace1', detail: 'path2' },
    { label: 'project3', description: 'workspace2', detail: 'path3' }
];

suite('project Quick Pick', () => {
    suite('show', () => {
        let promiseListStub: sinon.SinonStub;
        let showQuickPickStub: sinon.SinonStub;
        
        setup(() => {
            promiseListStub = sinon.stub(projectList, 'promiseList').returns(Promise.resolve(promisedProjects));
            showQuickPickStub = sinon.stub(window, 'showQuickPick').returns(Promise.resolve());
        });
        
        teardown(() => {
            promiseListStub.restore();
        });
        
        test('it shows expectedQuickPickItems', (testDone) => {
            showProjectQuickPick().then(() => {
                sinon.assert.calledOnce(showQuickPickStub);
                sinon.assert.calledWithExactly(showQuickPickStub, expectedQuickPickItems);
                testDone();
            }, (error) => {
                console.log(error);
            });
        });
    });
});