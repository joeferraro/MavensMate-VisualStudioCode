import assert = require('assert');
import sinon = require('sinon');
import path = require('path');
import fs = require('fs-promise');
import Promise = require('bluebird');

import jsonFile = require('../../src/workspace/jsonFile');
import vscode = require('vscode');

import { ProjectSettings, hasProjectSettings } from '../../src/mavensmate/projectSettings';
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

        test('hasProjectSettings fails with no projectPath', (testDone) => {
            hasProjectSettings()
                .then(() => {
                    assert.fail('should have rejected the promise');
                },(error) => {
                    assert.equal('no settings', error);
                    sinon.assert.calledWith(statStub, workspaceSettingsPath);
                })
                .then(() => {
                    testDone();
                });
        });

        test('hasProjectSettings fails with projectPath', (testDone) => {
            hasProjectSettings(projectPath)
                .then(() => {
                    assert.fail('should have rejected the promise');
                },(error) => {
                    assert.equal('no settings', error);
                    sinon.assert.calledWith(statStub, projectSettingsPath);
                })
                .then(() => {
                    testDone();
                });
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

        test('hasProjectSettings succeeds with no projectPath', (testDone) => {
            hasProjectSettings()
                .then(null,(error) => {
                    assert.fail(error);
                })
                .then(() => {
                    testDone();
                });
        });

        test('hasProjectSettings succeeds with projectPath', (testDone) => {
            hasProjectSettings(projectPath)
                .then(null,(error) => {
                    assert.fail(error);
                })
                .then(() => {
                    testDone();
                });
        });

        test('getProjectSettings gets settings with no projectPath', () => {
            let actualSettings = ProjectSettings.getProjectSettings();
            
            assert.equal(actualSettings.id, testSettings.id, 'id of settings');
            sinon.assert.calledWith(jsonFileStub, workspaceSettingsPath);
        });

        test('getProjectSettings gets settings with projectPath', () => {
            let actualSettings = ProjectSettings.getProjectSettings(projectPath);
            
            assert.equal(actualSettings.id, testSettings.id, 'id of settings');
            sinon.assert.calledWith(jsonFileStub, projectSettingsPath);
        });
    });
});