import assert = require('assert');
import sinon = require('sinon');
import fs = require('fs-promise');
import path = require('path');

import jsonFile = require('../../src/workspace/jsonFile');
import { ProjectSettings } from '../../src/mavensmate/projectSettings';
import projectList = require('../../src/workspace/projectList');
import mavensMateAppConfig = require('../../src/mavensmate/mavensMateAppConfig');

let appConfig = {
    mm_workspace: ['workspace1', 'workspace2/','missingWorkspace']
};
let workspace1Projects = ['.shouldIgnoreMe', 'project1', 'project2'];
let workspace2Projects = ['project1', 'project3','doesNotExist'];

let testSettings: ProjectSettings  = {
    id: 'testid1',
    projectName: 'project name',
    instanceUrl: 'instance'
};

let promiseWorkspace1Projects = Promise.resolve(workspace1Projects);
let promiseWorkspace2Projects = Promise.resolve(workspace2Projects);

suite('projectList', () => {
    let getConfigStub: sinon.SinonStub;
    let readDirStub: sinon.SinonStub;
    let jsonFileStub: sinon.SinonStub;
    setup(() => {
        getConfigStub = sinon.stub(mavensMateAppConfig, 'getConfig').returns(appConfig);
        
        readDirStub = sinon.stub(fs,'readdir');
        readDirStub.withArgs('workspace1').returns(promiseWorkspace1Projects);
        readDirStub.withArgs('workspace2/').returns(promiseWorkspace2Projects);
        readDirStub.withArgs('missingWorkspace').returns(Promise.reject('missingWorkspace is missing as intended'));
        
        jsonFileStub = sinon.stub(jsonFile, 'open');
        jsonFileStub.withArgs(path.normalize('workspace1/project1/config/.settings')).returns(testSettings);
        jsonFileStub.withArgs(path.normalize('workspace1/project2/config/.settings')).returns(testSettings);
        jsonFileStub.withArgs(path.normalize('workspace2/project1/config/.settings')).returns(testSettings);
        jsonFileStub.withArgs(path.normalize('workspace2/project3/config/.settings')).returns(testSettings);
        jsonFileStub.withArgs(path.normalize('workspace2/doesNotExist/config/.settings')).returns(null);
    });
    
    teardown(() => {
        getConfigStub.restore();
        readDirStub.restore();
        jsonFileStub.restore();
    });
    
    test('gets the 4 actual projects', (testDone) => {
        projectList.promiseList().then((projects) => {
                assert.equal(projects.length, 4);
                assertIsProject(projects[0], 'project1', path.normalize('workspace1/project1'), 'workspace1');
                assertIsProject(projects[1], 'project2', path.normalize('workspace1/project2'), 'workspace1');
                assertIsProject(projects[2], 'project1', path.normalize('workspace2/project1'), 'workspace2');
                assertIsProject(projects[3], 'project3', path.normalize('workspace2/project3'), 'workspace2');
            })
            .done(testDone, console.error);
    });
});

function assertIsProject(project, name, path, workspace){
    assert.equal(project.name, name);
    assert.equal(project.path, path);
    assert.equal(project.workspace, workspace);
}