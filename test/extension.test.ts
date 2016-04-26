import * as assert from 'assert';
import * as sinon from 'sinon';

import { MavensMateClient } from '../src/mavensmate/mavensMateClient';
import { MavensMateStatus } from '../src/vscode/mavensMateStatus';

import * as vscode from 'vscode';

suite("MavensMate Extension", () => {
    let mavensMateExtension : vscode.Extension<any>;
    let mavensMateClient;
    let mavensMateClientCreateStub : sinon.SinonStub;
    let mavensMateStatus;
    let mavensMateStatusCreateStub : sinon.SinonStub;
    
    setup(() => {
        mavensMateClient = {};
        
        mavensMateClientCreateStub = sinon.stub(MavensMateClient, "Create");
        mavensMateClientCreateStub.returns(mavensMateClient);
        
        mavensMateStatus = {};
        mavensMateStatus.updateAppStatus = sinon.stub();
        
        mavensMateStatusCreateStub = sinon.stub(MavensMateStatus, "Create");
        mavensMateStatusCreateStub.returns(mavensMateStatus);
        
        mavensMateExtension = vscode.extensions.getExtension("DavidHelmer.mavensmate");
        assert.notEqual(undefined, mavensMateExtension); 
    });
    
    test("activates", () => {
        return mavensMateExtension.activate()
            .then(() => {
                assert(mavensMateStatus.updateAppStatus.calledOnce);
            });
    });
});