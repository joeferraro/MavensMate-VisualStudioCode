import assert = require('assert');
import sinon = require('sinon');
import path = require('path');
import fs = require('fs-promise');
import Promise = require('bluebird');

import jsonFile = require('../../src/workspace/jsonFile');
import vscode = require('vscode');

let workspacePath = vscode.workspace.rootPath;
let workspaceSettingsPath = path.join(workspacePath, 'config', '.settings');
let projectPath = 'someProject';
let projectSettingsPath = path.join(projectPath, 'config', '.settings');

let testSettings: projectSettings.ProjectSettings  = {
    id: 'testid1',
    project_name: 'project name',
    instanceUrl: 'instance'
};

import projectSettings = require('../../src/mavensmate/projectSettings');

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
            projectSettings.hasProjectSettings()
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
            projectSettings.hasProjectSettings(projectPath)
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
            projectSettings.hasProjectSettings()
                .then(null,(error) => {
                    assert.fail(error);
                })
                .then(() => {
                    testDone();
                });
        });

        test('hasProjectSettings succeeds with projectPath', (testDone) => {
            projectSettings.hasProjectSettings(projectPath)
                .then(null,(error) => {
                    assert.fail(error);
                })
                .then(() => {
                    testDone();
                });
        });

        test('getProjectSettings gets settings with no projectPath', () => {
            let actualSettings = projectSettings.getProjectSettings();
            
            assert.equal(actualSettings.id, testSettings.id, 'id of settings');
            sinon.assert.calledWith(jsonFileStub, workspaceSettingsPath);
        });

        test('getProjectSettings gets settings with projectPath', () => {
            let actualSettings = projectSettings.getProjectSettings(projectPath);
            
            assert.equal(actualSettings.id, testSettings.id, 'id of settings');
            sinon.assert.calledWith(jsonFileStub, projectSettingsPath);
        });
    });
});