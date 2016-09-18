import assert = require('assert');
import sinon = require('sinon');

import { MavensMateStatus } from '../../src/vscode/mavensMateStatus';

import vscode = require('vscode');

suite("MavensMateStatus", () => {
    let mavensMateStatus;
    
    suite("updateAppStatus", () => {
        let statusBarItem;
        let createStatusBarItemStub;
    
        setup(() => {
            statusBarItem = {};
            statusBarItem.show = sinon.stub();
            
            createStatusBarItemStub = sinon.stub(vscode.window, "createStatusBarItem");
            createStatusBarItemStub.returns(statusBarItem);
            
            mavensMateStatus = MavensMateStatus.getInstance();
        });
    
        teardown(() => {
            createStatusBarItemStub.restore();
        });
    
        suite("when MavensMateApp is Available", () => {
            test("it sets the statusBarItem to Check", () => {
                return mavensMateStatus.updateAppStatus().then(() => {
                    assert(statusBarItem.show.calledOnce);
                    assert.equal(statusBarItem.text, "MavensMate $(check)");
                });
            });
        });
        
        suite("when MavensMateApp is not Available", () => {
            test("it sets the statusBarItem to alert", () => {
                return mavensMateStatus.updateAppStatus().then(() => {
                    assert(statusBarItem.show.calledOnce);
                    assert.equal(statusBarItem.text, "MavensMate $(alert)");
                });
            });
        });
    });
});