import assert = require('assert');
import sinon = require('sinon');

import { MavensMateClient } from '../../src/mavensmate/mavensMateClient';
import { MavensMateStatus } from '../../src/vscode/mavensMateStatus';
import { MavensMateChannel } from '../../src/vscode/mavensMateChannel';

import vscode = require('vscode');

let mavensMateClientOptions = {
    baseURL: 'http://localhost:55555'
}; 
suite("MavensMateStatus", () => {
    let mavensMateClient = new MavensMateClient(mavensMateClientOptions);
    let mavensMateChannel = MavensMateChannel.Create();
    let mavensMateStatus;
    
    suite("updateAppStatus", () => {
        let statusBarItem;
        let createStatusBarItemStub;
    
        setup(() => {
            statusBarItem = {};
            statusBarItem.show = sinon.stub();
            
            createStatusBarItemStub = sinon.stub(vscode.window, "createStatusBarItem");
            createStatusBarItemStub.returns(statusBarItem);
            
            mavensMateStatus = new MavensMateStatus(mavensMateClient, mavensMateChannel);
        });
    
        teardown(() => {
            createStatusBarItemStub.restore();
        });
    
        suite("when MavensMateApp is Available", () => {
            let mavensMateClientStub;
            
            setup(() => {
                mavensMateClientStub = sinon.stub(MavensMateClient.prototype, 'isAppAvailable');
                mavensMateClientStub.returns(Promise.resolve(true));
            });
        
            teardown(() => {
                mavensMateClientStub.restore();
            });
            
            test("it sets the statusBarItem to Check", () => {
                return mavensMateStatus.updateAppStatus().then(() => {
                    assert(statusBarItem.show.calledOnce);
                    assert.equal(statusBarItem.text, "MavensMate $(check)");
                });
            });
        });
        
        suite("when MavensMateApp is not Available", () => {
            let mavensMateClientStub;
            
            setup(() => {
                mavensMateClientStub = sinon.stub(MavensMateClient.prototype, 'isAppAvailable');
                mavensMateClientStub.returns(Promise.reject("404"));
            });
            
            teardown(() => {
                mavensMateClientStub.restore(); 
            });
            
            test("it sets the statusBarItem to alert", () => {
                return mavensMateStatus.updateAppStatus().then(() => {
                    assert(statusBarItem.show.calledOnce);
                    assert.equal(statusBarItem.text, "MavensMate $(alert)");
                });
            });
        });
    });
});