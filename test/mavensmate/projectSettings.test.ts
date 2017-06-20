import expect = require('expect.js');
import sinon = require('sinon');
import path = require('path');
import fs = require('fs');
import Promise = require('bluebird');

import jsonFile = require('../../src/workspace/jsonFile');
import vscode = require('vscode');

import { ProjectSettings } from '../../src/mavensmate/projectSettings';
let workspacePath = vscode.workspace.rootPath;
let workspaceSettingsPath = path.join(workspacePath, 'config', '.settings');
let projectPath = 'someProject';
let projectSettingsPath = path.join(projectPath, 'config', '.settings');

let testSettings: ProjectSettings  = {
    id: 'testid1',
    projectName: 'project name',
    instanceUrl: 'instance'
};


suite('projectSettings', () => {
    let statStub: sinon.SinonStub;
    let jsonFileStub: sinon.SinonStub;

    suite('when it does not exist', () => {
        setup(() => {
            let statFailure = Promise.reject('no settings');

            statStub = sinon.stub(fs, 'stat');
            statStub.withArgs(workspaceSettingsPath).returns(statFailure);
            statStub.withArgs(projectSettingsPath).returns(statFailure);
        });

        teardown(() => {
            statStub.restore();
        });

        test('hasProjectSettings fails with no projectPath', () => {
            let result = ProjectSettings.hasProjectSettings();

            expect(result).to.be(false);
        });

        test('hasProjectSettings fails with projectPath', () => {
            let result = ProjectSettings.hasProjectSettings();

            expect(result).to.be(false);
        });
    });
    suite('when it does exist', () => {
        setup(() => {
            let statSuccess = Promise.resolve();

            statStub = sinon.stub(fs, 'stat');
            statStub.withArgs(workspaceSettingsPath).returns(statSuccess);
            statStub.withArgs(projectSettingsPath).returns(statSuccess);

            jsonFileStub = sinon.stub(jsonFile, 'open').returns(testSettings);
        });

        teardown(() => {
            statStub.restore();
            jsonFileStub.restore();
        });

        test('hasProjectSettings succeeds with no projectPath', () => {
            let result = ProjectSettings.hasProjectSettings();

            expect(result).to.be(true);
        });

        test('hasProjectSettings succeeds with projectPath', () => {
            let result = ProjectSettings.hasProjectSettings(projectSettingsPath);

            expect(result).to.be(true);
        });

        test('getProjectSettings gets settings with no projectPath', () => {
            let actualSettings = ProjectSettings.getProjectSettings();
            
            expect(actualSettings.id).to.equal(testSettings.id, 'id of settings');
        });

        test('getProjectSettings gets settings with projectPath', () => {
            let actualSettings = ProjectSettings.getProjectSettings(projectPath);
            
            expect(actualSettings.id).to.equal(testSettings.id, 'id of settings');
        });
    });
});
